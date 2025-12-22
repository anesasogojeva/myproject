import axios from "axios";

export const createCODOrder = async (token, address) => {
  const res = await axios.post(
    "http://localhost:5000/api/cod/create-cod-order",
    { address },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
