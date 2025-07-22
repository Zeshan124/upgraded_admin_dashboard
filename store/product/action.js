export const actionTypes = {
  SET_PRODUCTS: "SET_PRODUCTS",
};

export function setProducts(products) {
  return { type: actionTypes.SET_PRODUCTS, payload: products };
}
