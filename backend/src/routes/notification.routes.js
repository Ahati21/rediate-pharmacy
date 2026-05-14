import express from "express";
import Notification from "../models/Notification.js";
import { requireAuth } from "../middleware/auth.js";
import { toPublicDocument } from "../utils/mongoose.js";

const router = express.Router();

// @desc    Get all notifications for the logged in user
// @route   GET /api/notifications
// @access  Private
router.get("/", requireAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.auth.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications.map(toPublicDocument),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.auth.userId,
    });

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      data: toPublicDocument(notification),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
router.patch("/read-all", requireAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.auth.userId, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.auth.userId,
    });

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
