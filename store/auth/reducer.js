// reducer.js
import { actionTypes } from "./action";

export const initState = {
  isLoggedIn: false,
  token: null,
  isLoading: false,
  error: null,
  fullName: null,
  roleID: null,
};

function reducer(state = initState, action) {
  
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
        isLoading: false,
        fullName: action.payload.fullName,
        roleID:action.payload.roleID
      };
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        error: action.payload,
        isLoading: false,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        fullName:"",
        roleID:null
      };
    // ... handle other action types
    default:
      return state;
  }
}

export default reducer;
