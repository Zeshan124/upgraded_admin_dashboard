// orderService.js
import { appendComparisonParams } from "~/util";
import axiosInstance from "./axiosInstance";
import Cookies from 'js-cookie';

const ordersUrl = "/orders";

export const searchOrder = async (keyword) => {
    const response = await axiosInstance.get(`${ordersUrl}/search`, {
      params: { keyword },
    });
    return response.data;
};

//
export const getOrderCount = async (startDate, endDate) => {
  // console.log('getOrderCount.',startDate, endDate)
    const response = await axiosInstance.get(`${ordersUrl}/ordercount?startDate=${startDate}&endDate=${endDate}`);
    // console.log('getOrderCount.',response)
    return response.data.data;
};

export const getOrderRevenue = async () => {
  const token = Cookies.get('token'); // Retrieve the token from cookies
    const headers = {
        'x-access-token': token || "", // Include the token in the request headers
    };
    const response = await axiosInstance.get(`${ordersUrl}/orderrevenue`,{headers});
    return response.data;
};

export const getOrderArea = async (startDate, endDate) => {
//  console.log(startDate, endDate)
    const response = await axiosInstance.get(`${ordersUrl}/orderarea?startDate=${startDate}&endDate=${endDate}`);
    // console.log(response)
    return response.data;
};

export const getOrderDetail = async () => {
    const response = await axiosInstance.get(`${ordersUrl}/orderdetail`);
    return response.data;

};
export const fetchOrdersReport = async (startDate, endDate,   previousStartDate = null,previousEndDate = null) => {

    const compareDates = appendComparisonParams({
      startDate: previousStartDate,
      endDate: previousEndDate,
    });
  const response = await axiosInstance.get(
    `${ordersUrl}/report?startDate=${startDate}&endDate=${endDate}${compareDates}`
  );
  // console.log('fetchOrdersReport', response)
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axiosInstance.get(`${ordersUrl}/get`);
  return response.data.data;
};
export const getAllOrdersPaginate = async (_start, _limit) => {
  const response = await axiosInstance.get(`${ordersUrl}/get?_start=${_start}&_limit=${_limit}`);

  return response.data;
};

export const fetchOrdersCSV = async (startDate, endDate) => {
    const response = await axiosInstance.get(
      `${ordersUrl}/export-orders-csv?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
};

export const getOrderById = async (orderID) => {
  const response = await axiosInstance.get(`${ordersUrl}/getbyid`, {
    params: { orderID: orderID },
  });
  return response.data.data[0];
};
