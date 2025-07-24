import axios from "axios";
import Cookies from "js-cookie";
import { appendComparisonParams } from "~/util";

const axiosInstance = axios.create({
  baseURL: "https://boms.qistbazaar.pk/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Attempt to retrieve the token from cookies
    const token = Cookies.get("tokenOMS");
    const tokenF = Cookies.get("tokenF");
    // If a token exists, set it in the headers
    if (token) {
      config.headers["x-access-token"] = token;
      config.headers["Authorization"] = `Bearer ${tokenF}`;
    } else {
      // Optional: Handle the case where there is no token available
      console.warn("No token available for request.");
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
export const loginOMS = async (username, password) => {
  const response = await axiosInstance.post(`/user/login`, {
    username,
    password,
  });

  return response;
};


export const fetchOrderStatus = async (startDate, endDate) => {
  const response = await axiosInstance.get(`/dashboard/branch-orders/count?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};


export const fetchOrderStatusWise = async (startDate, endDate) => {

  const response = await axiosInstance.get(`/order/branch-order?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};


export const fetchDeliveredOrders = async (startDate, endDate) => {

  const response = await axiosInstance.get(
    `/sap/analytics/sale?startDate=${startDate}&endDate=${endDate}`
  );

  return response?.data?.data || [];
};

export const SaleRecords = async (startDate, endDate, previousStartDate = null, previousEndDate = null) => {
    const compareDates = appendComparisonParams({startDate:previousStartDate,endDate:previousEndDate})

  const response = await axiosInstance.get(
    `/sap/analytics/total-sale?startDate=${startDate}&endDate=${endDate}${compareDates}`
  );

  return response?.data || [];
};

export const TopCategory = async (startDate, endDate) => {
  const response = await axiosInstance.get(`/sap/analytics/item-sale?startDate=${startDate}&endDate=${endDate}`);

  return response?.data || [];
};

export async function SapItemLookup(keyword) {
  let url = `/sap/analytics/invertory-items?keyword=${keyword}`;
  const response = await axiosInstance.get(url);
  return response?.data?.data || [];
  
}


export const fetchInstallementReceived = async (startDate, endDate, previousStartDate = null, previousEndDate = null) => {
  console.log(
    `/sap/analytics/recovery?startDate=${startDate}&endDate=${endDate}`
  );
  const compareDates = appendComparisonParams({startDate:previousStartDate,endDate:previousEndDate})
  const response = await axiosInstance.get(
    `/sap/analytics/recovery?startDate=${startDate}&endDate=${endDate}${compareDates}`
  );

  return response?.data?.data || response?.data || [];
};


export const fetchTotalInstallementReceived = async (startDate, endDate) => {

  const response = await axiosInstance.get(
    `/sap/analytics/total-recovery?startDate=${startDate}&endDate=${endDate}`
  );

  return response?.data?.data || response?.data || [];
};

export const fetchExpodetails = async (startDate, endDate) => {
  const response = await axiosInstance.get(
    `/pre-approved/expo-status?startDate=${startDate}&endDate=${endDate}`
  );

  return response?.data || response || {};
};

export const fetchVendorOrdersExport = async (startDate, endDate) => {
  const response = await axiosInstance.get(
    `/marketplace/vendor-orders-export?startDate=${startDate}&endDate=${endDate}`,
    { responseType: 'blob' } 
  );

  return response?.data;
};




export const fetchOrderByCreditStatus = async ( startDate, endDate, previousStartDate=null ,previousEndDate=null) => {
  const compareDates = appendComparisonParams({startDate:previousStartDate,endDate:previousEndDate})
  console.log(
    "/order/order-summary-oms?startDate=${startDate}&endDate=${endDate}${compareDates"
  );
  const response = await axiosInstance.get(
    `/order/order-summary-oms?startDate=${startDate}&endDate=${endDate}${compareDates}`,

  );
  console.log(response.data, 'fetchOrderByCreditStatus')
   
  return response?.data;
};



export const fetchCitySalesSap = async ( startDate, endDate) => {

  const response = await axiosInstance.get(
    `/sap/analytics/city-sale?startDate=${startDate}&endDate=${endDate}`
  );
  console.log(response, "fetchCitySalesSap");

   
  return response?.data?.data || [];
};

export const fetchBranchSalesSap = async (startDate, endDate) => {
  const response = await axiosInstance.get(
    `/sap/analytics/branch-sale?startDate=${startDate}&endDate=${endDate}`
  );
  console.log(response, "fetchBranchSalesSap ");

  return response?.data?.data || [];
};
export const fetchUnpostedSAP = async (startDate, endDate) => {
  const response = await axiosInstance.get(
    `/sap/analytics/unposted-order?startDate=${startDate}&endDate=${endDate}`
  );
  console.log(response, "fetchBranchSalesSap ");

  return response?.data?.data || [];
};