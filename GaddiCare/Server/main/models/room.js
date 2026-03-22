import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const chatRoomSchema = new Schema(
  {
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "members.model",
        },
        model: {
          type: String,
          required: true,
          enum: ["User", "Workshop"],
        },
      },
    ],

    owner: {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "owner.model",
      },
      model: {
        type: String,
        required: true,
        enum: ["User", "Workshop"],
      },
    },

    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],

    recentMessage: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ChatRoom = models.ChatRoom || model("ChatRoom", chatRoomSchema);
export default ChatRoom;
