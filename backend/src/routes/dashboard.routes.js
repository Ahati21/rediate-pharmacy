import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Medicine } from '../models/Medicine.js';
import { Order } from '../models/Order.js';
import { Pharmacist } from '../models/Pharmacist.js';

const router = Router();

router.get('/stats', requireAuth, requireRole('admin', 'pharmacist'), async (_req, res, next) => {
  try {
    const [
      totalMedicines,
      lowStockCount,
      expiringCount,
      expiredCount,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalPharmacists,
      recentOrders
    ] = await Promise.all([
      Medicine.countDocuments(),
      Medicine.countDocuments({ 
        $or: [
          { status: 'Low Stock' },
          { stock: { $lte: 15 } }
        ] 
      }),
      Medicine.countDocuments({ status: 'Expiring' }),
      Medicine.countDocuments({ status: 'Expired' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
      Pharmacist.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('items.medicineId')
    ]);

    // Calculate total revenue from delivered orders
    const deliveredOrdersData = await Order.find({ status: 'delivered' });
    const totalRevenue = deliveredOrdersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        inventory: {
          total: totalMedicines,
          lowStock: lowStockCount,
          expiring: expiringCount,
          expired: expiredCount
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          delivered: deliveredOrders,
          recent: recentOrders
        },
        revenue: {
          total: Number(totalRevenue.toFixed(2))
        },
        pharmacists: {
          total: totalPharmacists
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

const salesPeriods = new Set(['daily', 'weekly', 'monthly']);

function getSalesPeriodRange(period) {
  const now = new Date();
  const start = new Date(now);

  if (period === 'daily') {
    start.setHours(0, 0, 0, 0);
  } else if (period === 'weekly') {
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return { start, end: now };
}

function getSalesTrend(orders, period, rangeStart) {
  // Use a slightly different target logic to avoid identical actual/target bars
  // especially when revenue is zero.
  const baseTarget = period === 'daily' ? 500 : period === 'weekly' ? 3000 : 12000;

  if (period === 'daily') {
    return [0, 4, 8, 12, 16, 20].map((hour) => {
      const revenue = orders
        .filter((order) => {
          const createdAt = new Date(order.createdAt);
          return createdAt.getHours() >= hour && createdAt.getHours() < hour + 4;
        })
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const target = Math.max(baseTarget / 6, revenue * 1.15);
      return { 
        label: `${String(hour).padStart(2, '0')}:00`, 
        actual: Number(revenue.toFixed(2)),
        projected: Number(target.toFixed(2))
      };
    });
  }

  if (period === 'weekly') {
    return Array.from({ length: 7 }, (_, index) => {
      const dayStart = new Date(rangeStart);
      dayStart.setDate(rangeStart.getDate() + index);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      const revenue = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dayStart && orderDate < dayEnd;
        })
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const target = Math.max(baseTarget / 7, revenue * 1.1);
      return {
        label: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        actual: Number(revenue.toFixed(2)),
        projected: Number(target.toFixed(2))
      };
    });
  }

  const now = new Date();
  const monthStart = new Date(rangeStart);
  const buckets = [
    { label: 'W1', start: 1, end: 8 },
    { label: 'W2', start: 8, end: 15 },
    { label: 'W3', start: 15, end: 22 },
    { label: 'W4', start: 22, end: 29 },
    { label: 'W5', start: 29, end: 32 },
  ];

  return buckets.map((bucket) => {
    const bucketStart = new Date(monthStart);
    bucketStart.setDate(bucket.start);
    const bucketEnd = new Date(monthStart);
    bucketEnd.setDate(bucket.end);
    const revenue = orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= bucketStart && orderDate < bucketEnd && orderDate <= now;
      })
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const target = Math.max(baseTarget / 5, revenue * 1.08);
    return { 
      label: bucket.label, 
      actual: Number(revenue.toFixed(2)),
      projected: Number(target.toFixed(2))
    };
  });
}

router.get('/sales', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const requestedPeriod = String(req.query.period || 'monthly').toLowerCase();
    const period = salesPeriods.has(requestedPeriod) ? requestedPeriod : 'monthly';
    const { start, end } = getSalesPeriodRange(period);
    
    // Calculate previous period range
    const prevStart = new Date(start);
    const prevEnd = new Date(start);
    if (period === 'daily') {
      prevStart.setDate(start.getDate() - 1);
    } else if (period === 'weekly') {
      prevStart.setDate(start.getDate() - 7);
    } else {
      prevStart.setMonth(start.getMonth() - 1);
    }

    const [currentOrders, previousOrders] = await Promise.all([
      Order.find({
        $or: [{ status: 'delivered' }, { paymentStatus: 'completed' }],
        createdAt: { $gte: start, $lte: end },
      }),
      Order.find({
        $or: [{ status: 'delivered' }, { paymentStatus: 'completed' }],
        createdAt: { $gte: prevStart, $lte: prevEnd },
      })
    ]);
    
    const totalSales = currentOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const averageOrderValue = currentOrders.length > 0 ? totalSales / currentOrders.length : 0;
    
    const prevTotalSales = previousOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const prevAverageOrderValue = previousOrders.length > 0 ? prevTotalSales / previousOrders.length : 0;

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    // Aggregate by medicine
    const medicineSales = {};
    currentOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const key = item.name;
          if (!medicineSales[key]) {
            medicineSales[key] = { name: item.name, volume: 0, revenue: 0, medicineId: item.medicineId };
          }
          medicineSales[key].volume += (item.quantity || 0);
          medicineSales[key].revenue += (item.totalPrice || 0);
        });
      }
    });
    
    const topMedicationsRaw = Object.values(medicineSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Fetch current stock for these medications
    const topMedications = await Promise.all(topMedicationsRaw.map(async (m) => {
      let currentStock = 0;
      if (m.medicineId) {
        const medicine = await Medicine.findById(m.medicineId);
        if (medicine) currentStock = medicine.stock;
      }
      return { ...m, currentStock };
    }));

    const totalSalesNum = Number(totalSales.toFixed(2));
    const netProfit = Number((totalSalesNum * 0.35).toFixed(2)); // Estimated 35% margin
    const prevNetProfit = Number((prevTotalSales * 0.35).toFixed(2));
    
    res.json({
      success: true,
      data: {
        totalSales: totalSalesNum,
        netProfit,
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        totalOrders: currentOrders.length,
        period,
        changes: {
          sales: calculateChange(totalSalesNum, prevTotalSales),
          profit: calculateChange(netProfit, prevNetProfit),
          avgValue: calculateChange(averageOrderValue, prevAverageOrderValue)
        },
        range: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
        topMedications: topMedications.map(m => {
          const name = m.name || 'Unknown';
          return {
            ...m,
            name,
            category: name.includes('Amox') ? 'Antibiotics' : name.includes('Lisino') ? 'Hypertension' : 'General',
            profit: Number((m.revenue * 0.35).toFixed(2)),
            icon: name.includes('Amox') ? 'pill' : name.includes('Lisino') ? 'monitor_heart' : 'medication'
          };
        }),
        salesTrend: getSalesTrend(currentOrders, period, start),
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
