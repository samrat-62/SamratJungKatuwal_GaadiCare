import Notification from "../../models/notification.js";

class ManageNotification {

    static fetchUserNotifications = async (req, res) => {
      try {
        const currentUser = req.authUser;
    
        if (!currentUser) {
          return res.status(401).json({ error: "Access denied" });
        }
    
        const list = await Notification.find({ userId: currentUser._id })
          .sort({ createdAt: -1 });
    
        return res.status(200).json({
          data: list,
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ error: "Server failure" });
      }
    };

    static deleteNotification = async (req, res) => {
      try {
        const authUser = req.authUser;
        const { notificationId } = req.params;
    
        if (!authUser) {
          return res.status(401).json({ message: "Unauthorized" });
        }
    
        const notification = await Notification.findOneAndDelete({
          _id: notificationId,
          userId: authUser._id,
        });
    
        if (!notification) {
          return res.status(404).json({ message: "Notification not found" });
        }
    
        return res.status(200).json({
          message: "Notification deleted successfully",
        });
      } catch (error) {
        console.error("Delete Notification Error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    };

    static clearNotifications = async (req, res) => {
  try {
    const currentUser = req.authUser;

    if (!currentUser) {
      return res.status(401).json({ error: "Access denied" });
    }

    await Notification.deleteMany({ userId: currentUser._id });

    return res.status(200).json({
      success: true,
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

static markNotificationsSeen = async (req, res) => {
  try {
    const currentUser = req.authUser;

    if (!currentUser) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const updateResult = await Notification.updateMany(
      { userId: currentUser._id, read: false },
      { read: true }
    );

    return res.status(200).json({
      updated: updateResult.modifiedCount,
    });
  } catch {
    return res.status(500).json({ error: "Failed to update notifications" });
  }
};
}

export default ManageNotification;