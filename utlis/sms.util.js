import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://www.pingsms.in/api/sendsms";

const sendSmsMessage = async (receiverNumber, code) => {
  try {
    console.log(receiverNumber, code);

    const apiKey =
      "1QWdPrpbvGnWffKeSecp6864JRr8Bjbc4QhykfCYl602a4uC1YhDA7aM3bvpuTs2";
    const template = "1207161834199284262";

    const headers = {
      "X-Authorization":
        "1QWdPrpbvGnWffKeSecp6864JRr8Bjbc4QhykfCYl602a4uC1YhDA7aM3bvpuTs2",
    };
    const message = `Dear Customer, Your verification OTP code is ${code}. Regards Vridhi Stores`;

    const apiUrl = `https://www.pingsms.in/api/sendsms?key=${encodeURIComponent(
      apiKey
    )}&sender=VRIDST&mobile=${encodeURIComponent(
      receiverNumber
    )}&language=1&product=1&message=${encodeURIComponent(
      message
    )}&template=${template}`;

    const response = await axios.get(apiUrl, { headers });

    return response.data;
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error.message);
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

export default sendSmsMessage;
