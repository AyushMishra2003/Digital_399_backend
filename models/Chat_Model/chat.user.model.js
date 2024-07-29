import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("Chat_User", userSchema);

export default User;
