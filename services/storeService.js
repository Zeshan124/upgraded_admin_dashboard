import axiosInstance from "./axiosInstance";

const storeRoute = "/store";
export const fetchStores = async (url) => {
  const response = await axiosInstance.get(`${storeRoute}${url}`);
  return response.data;
};

export const fetchStoreBySlug = async (url) => {
  const response = await axiosInstance.get(`${storeRoute}${url}`);
  return response.data.data && response.data.data.length > 0
    ? response.data.data[0]
    : {};
};
export const deleteStore = async (id) => {
  const response = await axiosInstance.delete(`${storeRoute}/delete`, {
    data: { storeID: id },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const updateStoreStatus = async (storeID, status) => {
  const response = await axiosInstance.patch(`${storeRoute}/status/update`, {
    storeID,
    status,
  });
  return response;
};

export const getStoresProducts = async (url) => {
  const response = await axiosInstance.get(`/store-products/approved?${url}`);
  return response;
};


export const getStoresProductsCount = async (url) => {
  const response = await axiosInstance.get(`${url}`);
  return response;
};



export const updateStoreProductStatus = async (data) => {
  const response = await axiosInstance.put(`/store-products/status/update`,data);
  return response;
};

export const getStoreOrders = async (url) => {
  const response = await axiosInstance.get(`/orders/admin/all-store-orders?${url}`);

  return response.data;
};


export const updateStoreOrdersStatus = async (data) => {
  const response = await axiosInstance.put(`/orders/store-order-status/update`,data);
  return response;
};


export const getAllStores= async (url) => {
  
  const response = await axiosInstance.get(`/store/get/web?_start=1&_limit=200`);
  return response.data;
};


