import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Fetch dashboard statistics for the logged-in captain
 */
export const getCaptainDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.dashboard;
  } catch (error) {
    console.error("Dashboard API Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to load dashboard.",
      }
    );
  }
};