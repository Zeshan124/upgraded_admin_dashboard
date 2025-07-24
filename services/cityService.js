// cityService.js
import axiosInstance from "./axiosInstance";

const cityURL = "/cities";

export const fetchCities = async () => {
  const response = await axiosInstance.get(`${cityURL}/get`);
  return response.data.data;
};

export const addCity = async (cityName) => {
  try {
    const response = await axiosInstance.post(`${cityURL}/add`, {
      cityName,
    });
    return response; // Return the response data
  } catch (error) {
    throw error; // Throw the error for handling in the component
  }
};
