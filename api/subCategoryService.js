import axiosInstance from "./axiosInstance";

const subCategoriesUrl = "/subcategories";

export const fetchAllSubCategories = async () => {
  const response = await axiosInstance.get(`${subCategoriesUrl}/get`);
  return response.data.data;
};

export const addSubCategory = async (subCategoryData) =>
  await axiosInstance.post(`${subCategoriesUrl}/add`, subCategoryData);

export const deleteSubCategory = async (subCategoryId) =>
  await axiosInstance.delete(`${subCategoriesUrl}/delete`, {
    data: { subCategoryID: subCategoryId },
  });

export const updateSubCategory = async (updatedSubCategoryData) =>
  await axiosInstance.put(`${subCategoriesUrl}/update`, updatedSubCategoryData);

export const getSubCategoryById = async (subCategoryId) => {
  const response = await axiosInstance.get(`${subCategoriesUrl}/getbyid`, {
    params: { subCategoryID: subCategoryId },
  });
  return response.data;
};
