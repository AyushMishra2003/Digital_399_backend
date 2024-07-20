import { model, Schema } from "mongoose";

const codeExpireSchema = new Schema(
  {
    verificationCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

codeExpireSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const CodeExpire = model("VerificationCode", codeExpireSchema);

export default CodeExpire;
