import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // Load .env variables

const ML_API_URL_1 = process.env.ML_API_URL_1; // Read ML API URL from .env


export const sendToMlApi = async (data) => {
  try {
    const formattedData = JSON.stringify(data, null, 2);
    console.log("Final Payload Sent to ML API:", formattedData);

    const response = await axios.post(process.env.ML_API_URL_1, formattedData, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data;
  } catch (error) {
    console.error("Errorsfs communicating with ML API:", error.message);
    throw new Error("Failed to communicate with the ML API");
  }
};


