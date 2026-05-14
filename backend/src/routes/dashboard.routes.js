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
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
      Pharmacist.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('items.medicineId')
    ]);

    // Calculate total revenue from delivered orders
    const deliveredOrdersData = await Order.find({ status: 'delivered' });
    const totalRevenue = deliveredOrdersData.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      success: true,
      data: {
        inventory: {
          total: totalMedicines,
          lowStock: lowStockCount,
          expiring: expiringCount
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
  if (period === 'daily') {
    return [0, 4, 8, 12, 16, 20].map((hour) => {
      const revenue = orders
        .filter((order) => {
          const createdAt = new Date(order.createdAt);
          return createdAt.getHours() >= hour && createdAt.getHours() < hour + 4;
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);

      return { 
        label: `${String(hour).padStart(2, '0')}:00`, 
        actual: Number(revenue.toFixed(2)),
        projected: Number((revenue * 1.05).toFixed(2))
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
        .filter((order) => order.createdAt >= dayStart && order.createdAt < dayEnd)
        .reduce((sum, order) => sum + order.totalAmount, 0);

      return {
        label: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        actual: Number(revenue.toFixed(2)),
        projected: Number((revenue * 1.1).toFixed(2))
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
      .filter((order) => order.createdAt >= bucketStart && order.createdAt < bucketEnd && order.createdAt <= now)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return { 
      label: bucket.label, 
      actual: Number(revenue.toFixed(2)),
      projected: Number((revenue * 1.15).toFixed(2)) // Dummy projection
    };
  });
}

router.get('/sales', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const requestedPeriod = String(req.query.period || 'monthly').toLowerCase();
    const period = salesPeriods.has(requestedPeriod) ? requestedPeriod : 'monthly';
    const { start, end } = getSalesPeriodRange(period);
    const deliveredOrders = await Order.find({
      status: 'delivered',
      createdAt: { $gte: start, $lte: end },
    });
    
    const totalSales = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = deliveredOrders.length > 0 ? totalSales / deliveredOrders.length : 0;
    
    // Aggregate by medicine
    const medicineSales = {};
    deliveredOrders.forEach(order => {
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
    const netProfit = Number((totalSalesNum * 0.338).toFixed(2)); // Mock 33.8% profit margin
    
    res.json({
      success: true,
      data: {
        totalSales: totalSalesNum,
        netProfit,
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        totalOrders: deliveredOrders.length,
        period,
        changes: {
          sales: 12.4,
          profit: 8.1,
          avgValue: -2.1
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
        salesTrend: getSalesTrend(deliveredOrders, period, start),
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
