import dotenv from "dotenv";
import axios from "axios";

dotenv.config(); // Load .env variables

const ML_API_URL_2 = process.env.ML_API_URL_2; // Read ML API URL from .env

export const callMLApi = async (inputData) => {
    try {
        const formattedData = JSON.stringify(inputData, null, 2);
        

        const response = await axios.post(process.env.ML_API_URL_2, formattedData, {
        headers: { "Content-Type": "application/json" }
      });

      console.log(response)
  
      return response.data;
    } catch (error) {
      console.error("Error communicating with ML API:", error.message);
      throw new Error("Failed to communicate with the ML API");
    }
};
