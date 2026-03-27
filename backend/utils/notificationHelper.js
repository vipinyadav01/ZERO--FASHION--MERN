import NotificationModel from "../models/notificationModel.js";
import UserModel from "../models/userModel.js";

/**
 * Creates a notification for all admin users
 */
export const notifyAdmins = async ({ title, message, type, priority = "medium", relatedData = null }) => {
  try {
    // Find all admin users
    const admins = await UserModel.find({ 
      $or: [
        { role: "admin" },
        { isAdmin: true }
      ]
    }).select("_id");

    if (admins.length === 0) return;

    // Create notifications for each admin
    const notifications = admins.map(admin => ({
      title,
      message,
      type,
      priority,
      recipient: admin._id,
      relatedData
    }));

    await NotificationModel.insertMany(notifications);
  } catch (error) {
    console.error("Error sending admin notifications:", error);
  }
};

/**
 * Creates a notification for a specific user
 */
export const notifyUser = async ({ userId, title, message, type = "system", priority = "medium", relatedData = null }) => {
  try {
    const notification = new NotificationModel({
      recipient: userId,
      title,
      message,
      type,
      priority,
      relatedData
    });
    await notification.save();
  } catch (error) {
    console.error("Error sending user notification:", error);
  }
};
