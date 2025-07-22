import { actionTypes } from "./action";

const initialState = {
  products: [],
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    default:
      return state;
  }
}
