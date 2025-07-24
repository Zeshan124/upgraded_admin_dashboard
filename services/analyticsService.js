import axios from "axios";
import axiosInstance from "./axiosInstance";
import Cookies from 'js-cookie';

const baseURL = "/analytics";

export const mostPurchaseProduct = async (startDate, endDate) => {
    

    try{
        const response = await axiosInstance.get(`${baseURL}/purchase-item?startDate=${startDate}&endDate=${endDate}`);

        if(response.status ===200){
            return response.data.data;
        }else{
            throw new Error(response?.data?.message || response?.message || 'Error')
        }
    }catch(err){
        console.error(err)
    }
};

export const mostPurchaseCategory = async (startDate, endDate) => {

    try{
        const response = await axiosInstance.get(`${baseURL}/purchase-category?startDate=${startDate}&endDate=${endDate}`);
        
        if(response.status ===200){
            return response.data.data;
        }else{
            throw new Error(response?.data?.message || response?.message || 'Error')
        }
    }catch(err){
       console.error(err)
    }
};

export const OrderSource = async (startDate, endDate) => {
    try{
        const response = await axiosInstance.get(`${baseURL}/order-source?startDate=${startDate}&endDate=${endDate}`);
        
        if(response.status ===200){
            return response.data.data;
        }else{
            throw new Error(response?.data?.message || response?.message || 'Error')
        }
    }catch(err){
       console.error(err)
    }
};

export const CitySource = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get(
      `${baseURL}/citiesCount?startDate=${startDate}&endDate=${endDate}`
    );

    if (response.status === 200) {
      return response?.data || [];
    } else {
      throw new Error(response?.data?.message || response?.message || "Error");
    }
  } catch (err) {
    console.error(err);
  }
};

export const MarketPlaceVendorOrders = async (startDate, endDate, storeURL) => {
  try {
    const response = await axiosInstance.get(
      `${baseURL}//marketplace?startDate=${startDate}&endDate=${endDate}&storeURL=${storeURL}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response?.data?.message || response?.message || "Error");
    }
  } catch (err) {
    console.error(err);
  }
};
export const peakHours = async (startDate, endDate) => {
    try{
        const response = await axiosInstance.get(`${baseURL}/hourly-peak-orders?startDate=${startDate}&endDate=${endDate}`);
       
        if(response.status ===200){
            return response.data.data;
        }else{
            throw new Error(response?.data?.message || response?.message || 'Error')
        }
    }catch(err){
       console.error(err)
    }
};
export const CallCenterOrders = async (startDate, endDate) => {
  try {
    let url = `${baseURL}/callcenter-orders?startDate=${startDate}&endDate=${endDate}`;

    const response = await axiosInstance.get(url);

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response?.data?.message || response?.message || "Error");
    }
  } catch (err) {
    console.error(err);
  }
};


export const BranchOrders = async (startDate, endDate) => {
    try{
        const response = await axiosInstance.get(`${baseURL}/Branch-orders?startDate=${startDate}&endDate=${endDate}`);
        
        if(response.status ===200){
            return response.data.data;
        }else{
            throw new Error(response?.data?.message || response?.message || 'Error')
        }
    }catch(err){
       console.error(err)
    }
};

export const CreditCheckCount = async (url,startDate, endDate) => {

    try{
        const response = await axiosInstance.get(`${baseURL}/${url}?startDate=${startDate}&endDate=${endDate}`);
       
        if(response.status ===200){
            return response.data.data;
        }else{
            throw new Error(response?.data?.message || response?.message || 'Error')
        }
    }catch(err){
       console.error(err)
    }
};