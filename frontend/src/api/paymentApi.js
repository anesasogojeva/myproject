// src/api/paymentApi.js
import axios from "axios";
import { API_URL } from "../config";

export const createCheckoutSession = async (token, address) => {
  const res = await axios.post(
    `${API_URL}/api/payment/create-checkout-session`,
    { address },   // <-- SEND DATA
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};