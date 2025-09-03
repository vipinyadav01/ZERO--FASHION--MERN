import express from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
  getNotificationStats,
} from "../controllers/notificationController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const notificationRouter = express.Router();

// User routes (require authentication)
notificationRouter.get("/user", authUser, getUserNotifications);
notificationRouter.patch("/:notificationId/read", authUser, markAsRead);
notificationRouter.patch("/mark-all-read", authUser, markAllAsRead);
notificationRouter.delete("/:notificationId", authUser, deleteNotification);
notificationRouter.get("/stats", authUser, getNotificationStats);

// Admin routes (require admin authentication)
notificationRouter.post("/create", adminAuth, createNotification);

export default notificationRouter;
