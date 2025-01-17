import { Schema, model } from "mongoose";

const enquirySchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

const Inquiry = model("INQUIRY", enquirySchema);

export default Inquiry;
