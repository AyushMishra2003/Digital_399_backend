import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.devindia.in/api/send/text/message/v1";

const sendWhatsAppMessage = async (receiverNumber, msgText, token) => {
  try {
    const username = process.env.WHATSAPP_API_USERNAME;
    const password = process.env.WHATSAPP_API_PASSWORD;

    console.log(receiverNumber, msgText, token);

    const apiUrl = `${BASE_URL}?username=${username}&password=${password}&receiver_number=${receiverNumber}&msgtext=${encodeURIComponent(
      msgText
    )}&token=${token}`;

    const response = await axios.post(apiUrl);

    return response.data; // Assuming the API returns some data upon success
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error.message);
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

export default sendWhatsAppMessage;
