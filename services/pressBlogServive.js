import axiosInstance from "./axiosInstance";

const pressandblogroute = "/press-blog";
export const fetchAllBlogs = async (url) => {
  const response = await axiosInstance.get(`${pressandblogroute}${url}`);
  return response.data.data;
};

export const fetchAllPress = async () => {
  const response = await axiosInstance.get(
    `/${pressandblogroute}/get-all?blog=1`
  );
  return response.data.data;
};
export const fetchBlogPressById = async (id) => {
    const response = await axiosInstance.get(`${pressandblogroute}/getbyid?id=${id}`);
    return response.data.data;
};


export const deletePage = async (id) => {
  const response = await axiosInstance.delete(`${pressandblogroute}/delete`, {
    data: { id: id },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const AddPressBlog = async (data) => {
  const response = await axiosInstance.post(`${pressandblogroute}/add`, data);
  return response;
};


export const UpdatePressBlog = async (data) => {
  const response = await axiosInstance.put(`${pressandblogroute}/update`, data);
  return response;
};
