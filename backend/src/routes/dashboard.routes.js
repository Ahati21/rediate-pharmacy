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

router.get('/sales', requireAuth, requireRole('admin'), async (_req, res, next) => {
  try {
    const deliveredOrders = await Order.find({ status: 'delivered' });
    
    const totalSales = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = deliveredOrders.length > 0 ? totalSales / deliveredOrders.length : 0;
    
    // Aggregate by medicine
    const medicineSales = {};
    deliveredOrders.forEach(order => {
      order.items.forEach(item => {
        const key = item.name;
        if (!medicineSales[key]) {
          medicineSales[key] = { name: item.name, volume: 0, revenue: 0 };
        }
        medicineSales[key].volume += item.quantity;
        medicineSales[key].revenue += item.totalPrice;
      });
    });
    
    const topMedications = Object.values(medicineSales)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalSales: Number(totalSales.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        topMedications,
        totalOrders: deliveredOrders.length
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
