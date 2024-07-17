// twilioService.js
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSms = (to, message) => {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio SMS-enabled phone number
    to: to // Phone number in format +1234567890
  });
};

export default sendSms;
