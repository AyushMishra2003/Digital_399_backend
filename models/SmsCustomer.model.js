import { Schema, model } from "mongoose";

const smsSchema = new Schema(
    {
        name: {
            type: String,
            default: "",
        },
        phoneNumber: {
            type: Number,
            default: "",
            required: true,
        },
        projectName: {
            type: String,
            default: "",
        },
        Quantity: {
            type: Number,
            default: 0,
        },
        startingDate: {
            type: Date,
        },
        domain: {
            type: String,
            required: true,
        },
        apiUserName: {
            type: String,
        },
        apiPassword: {
            type: String,
        },
        apiKey: {
            type: Object,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure phoneNumber, domain, and apiKey are unique together
smsSchema.index({ phoneNumber: 1, domain: 1, apiKey: 1 }, { unique: true });

const SMS = model("SMSCHMEA", smsSchema);

export default SMS;
