import axios from "axios";
import { API_URL } from "../config";

const USERS_URL = `${API_URL}/api/users`;

export const registerUser = (data) => axios.post(`${USERS_URL}/register`, data);
export const loginUser = (data) => axios.post(`${USERS_URL}/login`, data);
export const getUsers = () => axios.get(USERS_URL);