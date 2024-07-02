

import { Schema, model } from "mongoose";
import SMS from "./SmsCustomer.model.js"
const smsSendingSchema = new Schema(
         [
            {
                customerId: {
                    type: Schema.Types.ObjectId, 
                    ref: 'SMS', 
                    required: true
                },
                sendingSms: {
                    message: {
                        type: String
                    },
                    contactNumber: {
                        type: Number
                    }
                },
                toWhom: {
                    type: Array
                },
                response: {
                    type: String,
                    enum: ["True", "False"],
                    default: "False"
                },
                smsCustomer_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'SMS' 
                }
            }
         ],
    {
        timestamps: true
    }
);

const smsSending = model("SMSSENDING", smsSendingSchema);

export default smsSending;
