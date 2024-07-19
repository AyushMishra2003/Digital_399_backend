import { Schema, model } from "mongoose";

const TrashfeedBackSchema = new Schema(
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
    feedbackId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TrashFeedback = model("TrashFeedBack", TrashfeedBackSchema);

export default TrashFeedback;
