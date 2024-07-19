import { Schema, model } from "mongoose";

const TrashEnquirySchema = new Schema(
  {
    inquiryName: {
      type: String,
      required: true,
    },
    inquiryEmail: {
      type: String,
      required: true,
    },
    inquiryPhoneNumber: {
      type: String,
      required: true,
    },
    inquiryMessage: {
      type: String,
      required: true,
    },
    basic_info_id: {
      type: Schema.Types.ObjectId,
      ref: "BasicInfo",
    },
    inquiryId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TrashInquiry = model("TRASH_INQUIRY", TrashEnquirySchema);

export default TrashInquiry;
