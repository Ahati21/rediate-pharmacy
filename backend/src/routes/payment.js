import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";

dotenv.config();

import { env } from "../config/env.js";
import { isValidObjectId } from "../utils/mongoose.js";

const router = express.Router();
const CHAPA_SECRET_KEY = env.chapaSecretKey || process.env.CHAPA_SECRET_KEY;
const CHAPA_BASE_URL = "https://api.chapa.co/v1";

// Helper function to add timeline entry
const addTimelineEntry = (timeline = [], status, note) => {
  return [
    ...timeline,
    {
      status,
      note,
      createdAt: new Date(),
    },
  ];
};

// Validate Chapa API key
if (!CHAPA_SECRET_KEY) {
  console.warn(
    "⚠️ CHAPA_SECRET_KEY is not configured in environment variables"
  );
}

// Initialize payment
router.post("/initialize", async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId || !isValidObjectId(orderId)) {
      return res.status(400).json({
        success: false,
        message: "A valid Order ID is required",
      });
    }

    // Fetch order from database
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "error",
        error: "Order not found",
      });
    }

    // Validate order can be paid
    if (order.paymentStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "This order has already been paid",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be paid",
      });
    }

    // Validate amount
    if (!order.totalAmount || order.totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    const tx_ref = `tx-${orderId}-${Date.now()}`;
    const userEmail = order.customerEmail || "noreply@rediate.com";
    const customerName = order.customerName || "Customer";
    const nameParts = customerName.split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || "Order";

    console.log(
      `📝 Initializing payment for order ${orderId}, amount: ${order.totalAmount}`
    );

    // Initialize payment with Chapa
    const response = await axios.post(
      `${CHAPA_BASE_URL}/transaction/initialize`,
      {
        amount: order.totalAmount.toString(),
        currency: "ETB",
        email: userEmail,
        first_name: firstName,
        last_name: lastName,
        phone_number: order.phoneNumber || "",
        tx_ref,
        callback_url:
          process.env.CHAPA_CALLBACK_URL ||
          `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payment/callback`,
        return_url:
          process.env.CHAPA_RETURN_URL ||
          `${process.env.FRONTEND_URL || "http://localhost:3000"}/checkout-success`,
        meta: {
          orderId: orderId.toString(),
          orderNumber: order.orderNumber,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.data?.checkout_url) {
      throw new Error("Chapa did not return checkout URL");
    }

    // Update order with transaction reference and add timeline
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        transactionRef: tx_ref,
        paymentStatus: "pending",
        $push: {
          timeline: {
            status: "pending",
            note: `Payment initialized - Tx Ref: ${tx_ref}`,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    console.log(`✅ Payment initialized successfully for order ${orderId}`);

    res.json({
      success: true,
      message: "Payment initialized successfully",
      checkout_url: response.data.data.checkout_url,
      tx_ref,
      order: {
        id: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        amount: updatedOrder.totalAmount,
      },
    });
  } catch (error) {
    console.error(
      "❌ Payment initialization error:",
      error.response?.data || error.message
    );

    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Payment initialization failed";

    res.status(statusCode).json({
      status: "error",
      error: errorMessage,
    });
  }
});

// Verify payment
router.post("/verify", async (req, res) => {
  try {
    const { tx_ref } = req.body;

    if (!tx_ref) {
      return res.status(400).json({
        status: "error",
        error: "Transaction reference (tx_ref) is required",
      });
    }

    console.log(`🔍 Verifying payment for tx_ref: ${tx_ref}`);

    // Verify transaction with Chapa
    const response = await axios.get(
      `${CHAPA_BASE_URL}/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    const { data: chapaData } = response.data;

    if (!chapaData) {
      return res.status(500).json({
        status: "error",
        error: "Invalid response from payment provider",
      });
    }

    console.log(`📊 Chapa response status: ${chapaData.status}`);

    // Find order by transaction reference
    const order = await Order.findOne({ transactionRef: tx_ref });

    if (!order) {
      console.warn(`⚠️ Order not found for tx_ref: ${tx_ref}`);
      return res.status(404).json({
        status: "error",
        error: "Order not found",
      });
    }

    // Handle successful payment
    if (chapaData.status === "success") {
      // Update order status and add timeline
      const updatedOrder = await Order.findByIdAndUpdate(
        order._id,
        {
          paymentStatus: "completed",
          paymentMethod: "chapa",
          paidAt: new Date(),
          status: "confirmed",
          $push: {
            timeline: {
              status: "confirmed",
              note: `✅ Payment completed - Amount: ETB ${chapaData.amount}`,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );

      console.log(`✅ Payment verified successfully for order ${order._id}`);

      return res.json({
        success: true,
        message: "Payment verified successfully",
        order: {
          id: updatedOrder._id,
          orderNumber: updatedOrder.orderNumber,
          paymentStatus: updatedOrder.paymentStatus,
          status: updatedOrder.status,
          totalAmount: updatedOrder.totalAmount,
          paidAt: updatedOrder.paidAt,
        },
      });
    }

    // Handle failed payment
    if (chapaData.status === "failed") {
      const updatedOrder = await Order.findByIdAndUpdate(
        order._id,
        {
          paymentStatus: "failed",
          $push: {
            timeline: {
              status: "pending",
              note: `❌ Payment failed - Reason: ${chapaData.status_reason || "Unknown"}`,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );

      console.log(`❌ Payment failed for order ${order._id}`);

      return res.status(400).json({
        status: "failed",
        message: "Payment failed",
        order: {
          id: updatedOrder._id,
          paymentStatus: updatedOrder.paymentStatus,
        },
      });
    }

    // Handle pending/processing payment
    if (chapaData.status === "pending") {
      return res.json({
        status: "pending",
        message: "Payment is still being processed",
        order: {
          id: order._id,
          paymentStatus: order.paymentStatus,
        },
      });
    }

    // Unknown status
    return res.status(400).json({
      status: "unknown",
      message: "Unknown payment status",
      paymentStatus: chapaData.status,
    });
  } catch (error) {
    console.error(
      "❌ Payment verification error:",
      error.response?.data || error.message
    );

    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || "Payment verification failed";

    res.status(statusCode).json({
      status: "error",
      error: errorMessage,
    });
  }
});

// Webhook callback from Chapa
router.post("/callback", async (req, res) => {
  try {
    const { tx_ref } = req.body;

    if (!tx_ref) {
      console.warn("⚠️ Callback received without tx_ref");
      return res.status(400).json({
        status: "error",
        error: "Transaction reference is required",
      });
    }

    console.log(`🔔 Webhook callback received for tx_ref: ${tx_ref}`);

    // Verify transaction with Chapa
    const response = await axios.get(
      `${CHAPA_BASE_URL}/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    const { data: chapaData } = response.data;

    // Find order
    const order = await Order.findOne({ transactionRef: tx_ref });

    if (!order) {
      console.warn(`⚠️ Order not found for callback tx_ref: ${tx_ref}`);
      return res.json({ status: "success" }); // Still return 200 to Chapa
    }

    // Handle successful payment
    if (chapaData.status === "success") {
      const updatedOrder = await Order.findByIdAndUpdate(
        order._id,
        {
          paymentStatus: "completed",
          paymentMethod: "chapa",
          paidAt: new Date(),
          status: "confirmed",
          $push: {
            timeline: {
              status: "confirmed",
              note: `✅ Payment confirmed via webhook - Amount: ETB ${chapaData.amount}`,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );

      console.log(`✅ Webhook: Payment confirmed for order ${order._id}`);

      // TODO: You can send notification email here
      // sendPaymentConfirmationEmail(updatedOrder.customerEmail, updatedOrder);

      return res.json({
        success: true,
        message: "Payment processed successfully",
      });
    }

    // Handle failed payment
    if (chapaData.status === "failed") {
      const updatedOrder = await Order.findByIdAndUpdate(
        order._id,
        {
          paymentStatus: "failed",
          $push: {
            timeline: {
              status: "pending",
              note: `❌ Payment failed via webhook - Reason: ${chapaData.status_reason || "Unknown"}`,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );

      console.log(`❌ Webhook: Payment failed for order ${order._id}`);

      // TODO: You can send failure notification email here
      // sendPaymentFailureEmail(updatedOrder.customerEmail, updatedOrder);

      return res.json({
        status: "success", // Still return 200 to acknowledge Chapa webhook
        message: "Payment failure recorded",
      });
    }

    console.log(`ℹ️ Webhook: Unhandled payment status ${chapaData.status}`);
    res.json({ status: "success" });
  } catch (error) {
    console.error(
      "❌ Webhook callback error:",
      error.response?.data || error.message
    );

    // Return 200 to Chapa to avoid retries, but log the error
    res.json({
      status: "success",
      message: "Webhook processed (with errors)",
    });
  }
});

// Get payment status
router.get("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).select(
      "orderNumber paymentStatus totalAmount paidAt transactionRef"
    );

    if (!order) {
      return res.status(404).json({
        status: "error",
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        paidAt: order.paidAt,
        transactionRef: order.transactionRef,
      },
    });
  } catch (error) {
    console.error("❌ Get payment status error:", error.message);
    res.status(500).json({
      status: "error",
      error: "Failed to fetch payment status",
    });
  }
});

// Get payment history for a customer
router.get("/history/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const limit = parseInt(String(req.query.limit || '10'), 10);
    const skip = parseInt(String(req.query.skip || '0'), 10);

    const orders = await Order.find({ customer: customerId })
      .select(
        "orderNumber paymentStatus totalAmount createdAt paidAt paymentMethod"
      )
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments({ customer: customerId });

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        limit,
        skip,
      },
    });
  } catch (error) {
    console.error("❌ Get payment history error:", error.message);
    res.status(500).json({
      status: "error",
      error: "Failed to fetch payment history",
    });
  }
});

export default router;
