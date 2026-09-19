// Base URL for the backend API and Socket.IO server.
// Set REACT_APP_API_URL in your deployment platform (e.g. Vercel) to your
// deployed backend's URL (e.g. https://your-backend.onrender.com).
// Falls back to localhost for local development.
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
