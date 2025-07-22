// couponService.js
import axiosInstance from "./axiosInstance";

const couponsUrl = "/coupon";

export const getAllCoupons = async () => {
  try {
    const response = await axiosInstance.get(`${couponsUrl}/get`);
    return response.data.data; // Modify this according to the actual response structure
  } catch (error) {
    console.error("Error fetching all coupons:", error);
    return null;
  }
};
export const addCoupon = async (couponData) => {
  try {
    const response = await axiosInstance.post(`${couponsUrl}/add`, couponData);
    return response; // Modify this according to the actual response structure
  } catch (error) {
    console.error("Error adding coupon:", error);
    return null;
  }
};

export const getCouponByCode = async (couponCode) => {
  try {
    const response = await axiosInstance.get(
      `${couponsUrl}/getbycode?couponCode=${couponCode}`
    );
    return response.data.data; // Modify this according to the actual response structure
  } catch (error) {
    console.error("Error fetching coupon by code:", error);
    return null;
  }
};

export const deleteCoupon = async (couponID) => {
  try {
    const response = await axiosInstance.delete(`${couponsUrl}/delete`, {
      data: { couponID },
    });
    return response.data; // Modify this according to the actual response structure
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return null;
  }
};

export const updateCoupon = async (updatedCouponData) => {
  try {
    const response = await axiosInstance.put(
      `${couponsUrl}/update`,
      updatedCouponData
    );

    return response; // Modify this according to the actual response structure
  } catch (error) {
    console.error("Error updating coupon:", error);
    return null;
  }
};
