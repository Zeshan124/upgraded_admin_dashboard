// productService.js
import axiosInstance from "./axiosInstance";

const productsUrl = "/products";

export const fetchAllProducts = async () => {
  const response = await axiosInstance.get(`/all-products`);

  return response.data.data;
};
export const fetchProductsPaginate = async (url) => {
  const response = await axiosInstance.get(
    `${productsUrl}${url}`
  );
  
  return response.data;
};
export const fetchDeletedProducts = async (url) => {
  const response = await axiosInstance.get(
    `/admin-products${url}`
  );
  
  return response.data;
};

export const fetchProductCSV = async (startDate, endDate) => {
    const response = await axiosInstance.get(
      `/exportproduct?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
};
export const addProduct = async (productData) =>
  await axiosInstance.post(`${productsUrl}/add`, productData);

export const deleteProduct = async (productID) =>
  await axiosInstance.delete(`${productsUrl}/delete`, {
    data: { productID },
  });

export const updateProduct = async (updatedProductData) =>
  await axiosInstance.put(`${productsUrl}/update/`, updatedProductData);

export const getProductById = async (productId) => {
  
  const response = await axiosInstance.get(`admin-products/${productId}`);
  return response.data.data;
};


export const searchProducts = async (keyword, category='') => {
  // console.log('i am here', keyword)
  let queryparams = {}; // Initialize queryparams as an empty object

  if (keyword.trim() !== '') {
    queryparams.keyword = keyword;
  }

  if (category !== '' && category) {
    queryparams.slug = category;
  }
  queryparams._start = 1
  queryparams._limit = 1000

  if (Object.keys(queryparams).length > 0) {
    try {

      const response = await axiosInstance.get(`/search-products`, {
        params: queryparams,
      });
      return response.data; // Adjust the response structure based on your API response
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }

};

export async function importProductCSV(formData) {
  const response = await axiosInstance.post('/importproduct', formData);
  return response
}
export async function getFeaturedProductsBySlug(slug) {
  const response = await axiosInstance.get(`/featureproduct?slug=${slug}`);

  return response.data.data
}
export const updateProductFeature = async (categoryID, productIDs) => {
    const data = {
        categoryID: categoryID,
        productIDs: JSON.stringify(productIDs) // Ensure productIDs is passed as a JSON string
    }
    try {
        const response = await axiosInstance.put('/product-feature/update', data);
        return response; // Adjust based on your API's response structure
    } catch (error) {
        throw new Error(`Error updating product feature: ${error.message}`);
    }
}

export const addProductFeature = async (categoryID, productIDs) => {
    // Prepare the data payload, ensuring productIDs are correctly formatted as a JSON string
    const data = {
        categoryID: categoryID,
        productIDs: JSON.stringify(productIDs) // Assuming productIDs is an array and needs to be stringified
    };
    try {
        // Make the POST request to the specified endpoint with the prepared data
        const response = await axiosInstance.post('/product-feature/add', data);
        return response; // Adjust based on your API's response structure
    } catch (error) {
        // Handle any errors that occur during the API call
        throw new Error(`Error adding product feature: ${error.message}`);
    }
};
export const fetchProductFeatureCategories = async () => {
    try {
        const response = await axiosInstance.get('/product-feature/categories');
        return response.data.data; // Adjust based on your API's response structure
    } catch (error) {
        throw new Error(`Error fetching product feature categories: ${error.message}`);
    }
};