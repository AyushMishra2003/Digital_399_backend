import { Schema, model } from "mongoose";

const feedBackSchema = new Schema(
  {
    feedBackStar: {
      type: Number,
    },
    feedBackMessage: {
      type: String,
    },
    basic_info_id: {
      type: Schema.Types.ObjectId,
      ref: "BasicInfo",
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = model("FeedBack", feedBackSchema);

export default Feedback;
