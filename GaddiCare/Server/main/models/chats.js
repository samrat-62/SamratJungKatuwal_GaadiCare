import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const chatSchema = new Schema(
  {
    sender: {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "sender.model",
      },
      model: {
        type: String,
        required: true,
        enum: ["User", "Workshop"],
      },
    },

    format: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
      required: true,
    },

    text: {
      type: String,
      validate: {
        validator: function (value) {
          return this.format !== "text" || Boolean(value?.trim());
        },
        message: "Text message cannot be empty",
      },
    },

    attachment: {
      type: String,
      validate: {
        validator: function (value) {
          return this.format === "text" || Boolean(value);
        },
        message: "Attachment is required for image/file messages",
      },
    },

    chatRoom: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  { timestamps: true }
);

const Chat = models.Chat || model("Chat", chatSchema);
export default Chat;
