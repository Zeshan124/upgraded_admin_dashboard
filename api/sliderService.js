import axiosInstance from "./axiosInstance";

export const addSlider = async (sliderImage, sliderUrl,mobSlider,order_position) => {
  try {
    const formData = new FormData();
    formData.append("sliderImage", sliderImage);
    formData.append("sliderurl", sliderUrl);
    formData.append("mobSlider", mobSlider);
    formData.append("order_position", order_position+1);
    formData.append("createdBy", 11);

    const response = await axiosInstance.post("/slider/add", formData);

    return response;
  } catch (error) {
    throw error;
  }
};

export const UpdateSlider = async (data) => {
  try {

    const response = await axiosInstance.patch("/slider/update", data);

    return response;
  } catch (error) {
    throw error;
  }
};
export const fetchSliders = async () => {
  try {
    const response = await axiosInstance.get("/slider/get");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getSliderById = async (sliderID) => {
  try {
    const response = await axiosInstance.get("/slider/getbyid", {
      params: { sliderID },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSlider = async (sliderID) => {
  try {
    const response = await axiosInstance.delete("/slider/delete", {
      data: { sliderID },
    });
    return response;
    // Optionally, perform any necessary state update after deletion
  } catch (error) {
    throw error;
  }
};
