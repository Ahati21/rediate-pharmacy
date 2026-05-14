import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Order } from '../models/Order.js';
import { Medicine } from '../models/Medicine.js';
import { isValidObjectId, toPublicDocument } from '../utils/mongoose.js';
import Notification from '../models/Notification.js';

const router = Router();

function roundCurrency(value) {
  return Number(Number(value || 0).toFixed(2));
}

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.customerEmail) {
      filter.customerEmail = String(req.query.customerEmail).toLowerCase();
    }

    if (req.auth.role === 'customer') {
      filter.customerEmail = req.auth.user.email;
    }

    const orders = await Order.find(filter)
      .populate('customer prescription items.medicineId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders.map(toPublicDocument),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order identifier',
      });
    }

    const order = await Order.findById(req.params.id).populate('customer prescription items.medicineId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (req.auth.role === 'customer' && order.customerEmail !== req.auth.user.email) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this order',
      });
    }

    res.json({
      success: true,
      data: toPublicDocument(order),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (!req.body.customerName || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and at least one order item are required',
      });
    }

    // 1. Validate items and check stock
    const normalizedItems = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      if (item.medicineId) {
        if (!isValidObjectId(item.medicineId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid medicine identifier: ${item.medicineId}`,
          });
        }

        const medicine = await Medicine.findById(item.medicineId);
        if (!medicine) {
          return res.status(404).json({
            success: false,
            message: `Medicine not found: ${item.name}`,
          });
        }

        if (medicine.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`,
          });
        }

        normalizedItems.push({
          medicineId: item.medicineId,
          name: medicine.name,
          quantity,
          unitPrice,
          totalPrice: roundCurrency(quantity * unitPrice),
        });
      } else {
        // Fallback for items without ID (e.g. manual entry if allowed)
        normalizedItems.push({
          name: item.name,
          quantity,
          unitPrice,
          totalPrice: roundCurrency(quantity * unitPrice),
        });
      }
    }

    const subtotal = roundCurrency(
      normalizedItems.reduce((sum, item) => sum + item.totalPrice, 0)
    );
    const tax = roundCurrency(req.body.tax);
    const deliveryFee = roundCurrency(req.body.deliveryFee);

    // 2. Create the order
    const order = await Order.create({
      ...req.body,
      customer: req.body.customer || req.auth.userId,
      customerEmail: req.body.customerEmail || req.auth.user.email,
      customerName: req.body.customerName || req.auth.user.name,
      items: normalizedItems,
      subtotal,
      tax,
      deliveryFee,
      totalAmount: roundCurrency(subtotal + tax + deliveryFee),
    });

    // 3. Decrement stock for medicines with IDs and update status
    for (const item of normalizedItems) {
      if (item.medicineId) {
        const updatedMedicine = await Medicine.findByIdAndUpdate(
          item.medicineId,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        // Update status if stock is low
        if (updatedMedicine && updatedMedicine.stock < 10 && updatedMedicine.status === 'Approved') {
          updatedMedicine.status = 'Low Stock';
          await updatedMedicine.save();
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: toPublicDocument(order),
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireAuth, requireRole('admin', 'pharmacist'), async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'verified', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order identifier',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    order.timeline.push({
      status,
      note: note || `Order moved to ${status}`,
    });

    await order.save();

    // Create notification for the customer
    try {
      const statusTitles = {
        verified: 'Payment Verified',
        preparing: 'Order Being Prepared',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Order Delivered',
        cancelled: 'Order Cancelled',
      };

      if (statusTitles[status]) {
        await Notification.create({
          user: order.customer,
          title: statusTitles[status],
          message: `Your order #${order.orderNumber} status has been updated to ${status}.`,
          type: status === 'cancelled' ? 'error' : status === 'delivered' ? 'success' : 'info',
          link: `/tracking?orderId=${order._id}`,
        });
      }
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: toPublicDocument(order),
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order identifier',
      });
    }

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
      data: toPublicDocument(order),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
