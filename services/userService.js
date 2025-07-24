// userService.js
import axiosInstance from "./axiosInstance";

const userLoginUrl = "/user/login";
const userSignupUrl = "/user/signup";

const usersUrl = "/user";

export const getAllUsers = async (accessToken) => {
  const response = await axiosInstance.get(`${usersUrl}/get`, {
    headers: {
      "x-access-token": accessToken,
    },
  });
  return response.data.data;
};
export const getAllUsersPagination = async (url,accessToken) => {
  const response = await axiosInstance.get(`${usersUrl}/get${url}`, {
    headers: {
      "x-access-token": accessToken,
    },
  });
  return response.data;
};

export const addUser = async (userData, accessToken) => {

  const response = await axiosInstance.post(`${usersUrl}/add`, userData, {
    headers: {
      "x-access-token": accessToken,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const searchUser = async (keyword, accessToken) => {
  const response = await axiosInstance.get(`${usersUrl}/search`, {
    headers: {
      "x-access-token": accessToken,
      "Content-Type": "application/json",
    },
    params: { keyword },
  });
  return response.data;
};

export const updateUser = async (userData, accessToken) => {
  const response = await axiosInstance.put(`${usersUrl}/update`, userData, {
    headers: {
      "x-access-token": accessToken,
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const deleteUser = async (userToDeleteId, accessToken) => {
  const response = await axiosInstance.delete(`${usersUrl}/delete`, {
    headers: {
      "x-access-token": accessToken,
      "Content-Type": "application/json",
    },
    data: { userToDeleteId },
  });
  return response.data;
};

export const loginUser = async (input, password) => {
  // Check if input is an email or username
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  // Construct the payload dynamically
  const userData = isEmail
    ? { email: input, password } // If it's an email
    : { userName: input, password }; // If it's a username
  const response = await axiosInstance.post(userLoginUrl, userData);
  return response;
};

export const firstLoginChangePassword = async (newPassword) => {
  // Check if input is an email or username
  const response = await axiosInstance.post(`${usersUrl}/reset-password`, {
    newPassword,
  });
  return response;
};

export const getUserDetails = async (accessToken) => {
  try {
    const response = await axiosInstance.get(`${usersUrl}/details`, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    return response.data;
  } catch (error) {
    throw error; // Rethrow the error for the caller to handle
  }
};
export const signupUser = async ({
  username,
  email,
  phoneNo,
  fullname,
  cnic,
  password,
  address,
  cityID,
  areaID,
  MacAdress,
}) => {
  const userData = {
    username,
    email,
    phoneNo,
    fullname,
    cnic,
    password,
    address,
    cityID,
    areaID,
    MacAdress,
  };
  const response = await axiosInstance.post(userSignupUrl, userData);
  return response.data;
};
