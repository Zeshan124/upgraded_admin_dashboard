import axios from "axios";
import Cookies from 'js-cookie';
const axiosInstance = axios.create({
  baseURL: "https://backend.qistbazaar.pk/api/",
  headers: {
    "Content-Type": "application/json",
   
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    // Attempt to retrieve the token from cookies
    const token = Cookies.get('token');
    
    // If a token exists, set it in the headers
    if (token) {
      config.headers['x-access-token'] = token;
    } else {
      // Optional: Handle the case where there is no token available
      console.warn('No token available for request.');
    }
    
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside the range of 2xx
      const errorMessage = `Request failed with status code ${
        error.response.status
      }: ${error.response.config.method.toUpperCase()} ${error.response.config.url}`;
      
      console.error(errorMessage);
      console.error("Response data:", error.response.data);

      // You can handle the error here or throw it for the caller to handle
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request made but no response received:", error.request);
      throw new Error("No response received from the server.");
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error setting up the request:", error.message);
      throw new Error(`Error setting up the request: ${error.message}`);
    }
  }
);

export default axiosInstance;
