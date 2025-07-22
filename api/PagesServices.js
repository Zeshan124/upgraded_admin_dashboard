// pageService.js
import axiosInstance from "./axiosInstance";

const pagesUrl = "/page";
const webPagesUrl = "/Custom-page";


export const addPage = async (pageData) => {
  const response = await axiosInstance.post(`${pagesUrl}/add`, pageData);
  return response;
};

export const WebAddPage = async (pageData) => {
  const response = await axiosInstance.post(`${webPagesUrl}/add`, pageData);
  return response;
};

export const fetchAllPages = async () => {
  const response = await axiosInstance.get(`${pagesUrl}/get`);
  return response.data.data; // Adjust according to the actual structure of your API response
};

export const fetchAllWebPages = async () => {
  const response = await axiosInstance.get(`${webPagesUrl}/get`);
  return response.data.data; // Adjust according to the actual structure of your API response
};
export const fetchSinglePage = async (pageSlug) => {
  const response = await axiosInstance.get(`${pagesUrl}/single?slug=${pageSlug}`);
  return response.data; // Adjust based on your API's response structure
};
export const fetchSingleWebPage = async (id) => {
  const response = await axiosInstance.get(`${webPagesUrl}/get/single?id=${id}`);
  return response.data; // Adjust based on your API's response structure
};
export const updatePage = async (updateData) => {
  const response = await axiosInstance.put(`${pagesUrl}/update`, updateData);
  return response;
};
export const UpdateWebPage = async (updateData) => {
  // console.log(updateData)
  const response = await axiosInstance.patch(`${webPagesUrl}/update`, updateData);
  return response;
};
export const deleteWebPage = async (pageId) => {
  const response = await axiosInstance.delete(`${webPagesUrl}/delete`, {
    data: { id: pageId },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response;
};


export const deletePage = async (pageId) => {
  const response = await axiosInstance.delete(`${pagesUrl}/delete`, {
    data: { pageID: pageId },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
