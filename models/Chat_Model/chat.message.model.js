import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    trim: true,
  },
  recipient: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
    default: "",
  },
  images: {
    public_id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema
const Message = mongoose.model("Chat_Message", messageSchema);

export default Message;
