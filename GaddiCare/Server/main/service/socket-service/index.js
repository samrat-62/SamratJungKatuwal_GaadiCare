import { Server } from "socket.io";
import mongoose from "mongoose";
import ChatRoom from "../../models/room.js";
import Notification from "../../models/notification.js";
import Chat from "../../models/chats.js";

let ioInstance;
const activeSockets = new Map();

export const pushAlert = async (payload) => {
  const alert = await Notification.create(payload);

  const socketId = activeSockets.get(String(payload.userId));
  if (socketId && ioInstance) {
    ioInstance.to(socketId).emit("newAlert", alert);
  }
};

const setupSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    const rawUserId = socket.handshake.query?.user;
    const userModel = socket.handshake.query?.model || "User";

    const userId =
      mongoose.Types.ObjectId.isValid(rawUserId)
        ? new mongoose.Types.ObjectId(rawUserId)
        : null;

    if (userId) {
      activeSockets.set(String(userId), socket.id);
      console.log(`User ${userId} connected with socketId ${socket.id}`);
    }

    socket.on("joinChat", async (roomId) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(roomId) || !userId) {
          return socket.emit("joinFailed", roomId);
        }

        const room = await ChatRoom.findOne({
          _id: roomId,
          "members.user": userId,
        });

        if (!room) {
          return socket.emit("joinFailed", roomId);
        }

        socket.join(roomId);
        socket.emit("joinSuccess", roomId);
        console.log(`User ${userId} joined room ${roomId}`);
      } catch (err) {
        console.error(err);
        socket.emit("joinFailed", roomId);
      }
    });

    socket.on("leaveChat", (roomId) => {
      socket.leave(roomId);
    });

    socket.on("sendChat", async (data) => {
      try {
        if (!data?.chatRoom || !userId) {
          return socket.emit("sendFailed");
        }

        const room = await ChatRoom.findOne({
          _id: data.chatRoom,
          "members.user": userId,
        });

        if (!room) {
          return socket.emit("sendFailed");
        }

        const chatPayload = {
          sender: {
            user: userId,  
            model: userModel,
          },
          chatRoom: data.chatRoom,
          format:
            data.format && data.format !== "text" ? data.format : "text",
        };

        if (chatPayload.format === "text") {
          if (!data.text || !data.text.trim()) {
            return socket.emit("sendFailed");
          }
          chatPayload.text = data.text;
        } else {
          if (!data.attachment) {
            return socket.emit("sendFailed");
          }
          chatPayload.attachment = data.attachment;
        }

        const savedChat = await Chat.create(chatPayload);

        room.messages.push(savedChat._id);
        room.recentMessage = savedChat._id;
        await room.save();

        const populatedChat = await Chat.findById(savedChat._id).populate({
          path: "sender.user", 
          select:
            "userName userImage workshopName workshopImage email",
        });

        ioInstance.to(data.chatRoom).emit("receiveChat", populatedChat);

        for (const member of room.members) {
          if (String(member.user) !== String(userId)) { 
            const senderName =
              populatedChat.sender.user?.userName || 
              populatedChat.sender.user?.workshopName ||
              "Someone";

            pushAlert({
              userId: member.user, 
              title: "New Message",
              content: `${senderName} sent a message`,
              read: false,
            });
          }
        }

        socket.emit("sendSuccess", {
          roomId: data.chatRoom,
          chatId: savedChat._id,
        });
      } catch (err) {
        console.error(err);
        socket.emit("sendFailed");
      }
    });

    socket.on("disconnect", () => {
      for (const [uid, sid] of activeSockets.entries()) {
        if (sid === socket.id) {
          activeSockets.delete(uid);
          break;
        }
      }
    });
  });
};

export { ioInstance, activeSockets };
export default setupSocket;