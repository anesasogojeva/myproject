import axios from "axios";
import { API_URL } from "../config";

export const createCODOrder = async (token, address) => {
  const res = await axios.post(
    `${API_URL}/api/cod/create-cod-order`,
    { address },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
