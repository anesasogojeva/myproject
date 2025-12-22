// src/api/paymentApi.js
import axios from "axios";

export const createCheckoutSession = async (token, address) => {
  const res = await axios.post(
    "http://localhost:5000/api/payment/create-checkout-session",
    { address },   // <-- SEND DATA
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};