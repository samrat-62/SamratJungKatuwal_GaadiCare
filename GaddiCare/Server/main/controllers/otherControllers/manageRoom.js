import ChatRoom from "../../models/room.js";
import mongoose from "mongoose";
import Chat from "../../models/chats.js";
import fs from "fs";
import path from "path";

class ManageRoom {

  static resolveModel(user) {
    return user.userType === "workshop" ? "Workshop" : "User";
  }


  static openChatRoom = async (req, res) => {
    try {
      const currentUser = req.authUser;
      const { targetUserId, targetUserType } = req.body;

      if (!currentUser || !targetUserId || !targetUserType) {
        return res.status(400).json({ error: "Required data missing" });
      }

      if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        return res.status(400).json({ error: "Invalid target user id" });
      }

      if (String(currentUser._id) === String(targetUserId)) {
        return res.status(400).json({ error: "Cannot start chat with yourself" });
      }

      const currentMember = {
        user: currentUser._id,
        model: ManageRoom.resolveModel(currentUser),
      };

      const targetMember = {
        user: targetUserId,
        model: targetUserType === "workshop" ? "Workshop" : "User",
      };

      const alreadyExists = await ChatRoom.findOne({
        "members.user": { $all: [currentMember.user, targetMember.user] },
      });

      if (alreadyExists) {
        return res.status(200).json({
          message: "Chat room already exists",
          room: alreadyExists,
          status: "existing",
        });
      }

      const newRoom = await ChatRoom.create({
        members: [currentMember, targetMember],
        owner: currentMember,
        recentMessage: null,
      });

      return res.status(201).json({
        message: "Chat room created successfully",
        room: newRoom,
        status: "created",
      });

    } catch (error) {
      console.error("Error creating chat room:", error);
      return res.status(500).json({ error: "Unable to create chat room" });
    }
  };

  static fetchUserChatRooms = async (req, res) => {
    try {
      const currentUser = req.authUser;

      if (!currentUser?._id) {
        return res.status(401).json({ error: "Access denied" });
      }

      const chatRooms = await ChatRoom.find({
        "members.user": currentUser._id,
      })
        .populate([
          {
            path: "members.user",
            select: "userName email userImage userType workshopName workshopImage",
          },
          {
            path: "owner.user",
            select: "userName email userImage workshopName workshopImage",
          },
          {
            path: "recentMessage",
            populate: {
              path: "sender.user",
              select: "userName userImage workshopName workshopImage userType",
            },
          },
        ])
        .sort({ updatedAt: -1 });

      return res.status(200).json({
        total: chatRooms.length,
        data: chatRooms,
      });

    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      return res.status(500).json({ error: "Unable to retrieve rooms" });
    }
  };

  static fetchRoomMessages = async (req, res) => {
    try {
      const { roomId } = req.params;
      const currentUser = req.authUser;

      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ error: "Invalid room id" });
      }

      if (!currentUser?._id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const room = await ChatRoom.findById(roomId)
        .populate([
          {
            path: "members.user",
            select: "_id userName userImage userType workshopName workshopImage",
          },
          {
            path: "owner.user",
            select: "_id userName userImage workshopName workshopImage",
          },
          {
            path: "recentMessage",
            populate: {
              path: "sender.user",
              select: "userName userImage workshopName workshopImage userType",
            },
          },
        ]);

      if (!room) {
        return res.status(404).json({ error: "Chat room not found" });
      }

      const isMember = room.members.some(
        (m) => m.user._id.toString() === currentUser._id.toString()
      );

      if (!isMember) {
        return res.status(403).json({ error: "Access denied to this room" });
      }

      const messages = await Chat.find({ chatRoom: roomId })
        .populate({
          path: "sender.user",
          select: "_id userName userImage workshopName workshopImage userType",
        })
        .sort({ createdAt: 1 });

      const otherParticipant = room.members.find(
        (m) => m.user._id.toString() !== currentUser._id.toString()
      );

      return res.status(200).json({
        success: true,
        messages,
        room: {
          id: room._id,
          members: room.members,
          otherParticipant,
          owner: room.owner,
          recentMessage: room.recentMessage,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        },
      });

    } catch (error) {
      console.error("Error fetching room messages:", error);
      return res.status(500).json({ error: "Failed to load chat messages" });
    }
  };

  static removeChatRoom = async (req, res) => {
    try {
      const { roomId } = req.params;
      const currentUser = req.authUser;

      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ error: "Invalid room id" });
      }

      if (!currentUser?._id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const room = await ChatRoom.findById(roomId);

      if (!room) {
        return res.status(404).json({ error: "Chat room not found" });
      }

      if (room.owner.user.toString() !== currentUser._id.toString()) {
        return res.status(403).json({ error: "You are not allowed to delete this room" });
      }

      const chats = await Chat.find({ chatRoom: roomId });

      for (const chat of chats) {
        if ((chat.format === "image" || chat.format === "file") && chat.attachment) {
          const filePath = path.join(process.cwd(),"Upload",chat.attachment);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      }

      await Chat.deleteMany({ chatRoom: roomId });
      await ChatRoom.findByIdAndDelete(roomId);

      return res.status(200).json({ success: true });

    } catch (error) {
      console.error("Error deleting room:", error);
      return res.status(500).json({ error: "Failed to delete chat room" });
    }
  };

  static uploadChatFile = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file provided" });
      }

      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        fileUrl: `chatFiles/${req.file.filename}`,
      });

    } catch (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size should be less than 5MB",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to upload file",
        error: error.message,
      });
    }
  };
}

export default ManageRoom;
