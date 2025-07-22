// areaService.js
import axiosInstance from "./axiosInstance";

const areasUrl = "/areas";

export const fetchAllAreas = async () => {
  const response = await axiosInstance.get(`${areasUrl}/get`);
  return response.data.data;
};

export const addArea = async (areaData) =>
  await axiosInstance.post(`${areasUrl}/add`, areaData);

export const deleteArea = async (areaID) =>
  await axiosInstance.delete(`${areasUrl}/delete`, {
    data: { areaID },
  });
export const updateArea = async (updatedAreaData) =>
  await axiosInstance.put(`${areasUrl}/update/`, updatedAreaData);
