// categoryService.js
import axiosInstance from "./axiosInstance";

const categoriesUrl = "/categories";

export const fetchAllCategories = async () => {
  const response = await axiosInstance.get(`${categoriesUrl}/get`);
  return response.data.data;
};

export const fetchProductCategories = async () => {
  const response = await axiosInstance.get(`/products-categories`);
  return response.data.data;
};

export const addCategory = async (categoryData) =>
  await axiosInstance.post(`${categoriesUrl}/add`, categoryData);

export const deleteCategory = async (categoryId) =>
  await axiosInstance.delete(`${categoriesUrl}/delete`, {
    data: { categoryID: categoryId },
  });

export const updateCategory = async (updatedCategoryData) =>
  await axiosInstance.put(`${categoriesUrl}/update`, updatedCategoryData);

export const getCategoryById = async (categoryId) => {
  const response = await axiosInstance.get(`${categoriesUrl}/getbyid`, {
    params: { categoryID: categoryId },
  });
  return response.data;
};
