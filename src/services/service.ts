import axios from "axios";
import { getAuthToken } from '@/services/authTokenService'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchData = async (endpoint: string) => {
  const token = getAuthToken();
  
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postData = async (endpoint: string, data: any) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(`${API_URL}/${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const deleteItem = async (endpoint: string) => {
  const token = getAuthToken();
  try {
    const response = await axios.delete(`${API_URL}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};
