// action.js
export const actionTypes = {
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
  CHECK_LOGIN: "CHECK_LOGIN",
};

export function loginSuccess(userData) {
  return { type: actionTypes.LOGIN_SUCCESS, payload: userData };
}
export function loginCheck() {
  return { type: actionTypes.CHECK_LOGIN };
}

export function loginFailure(error) {
  return { type: actionTypes.LOGIN_FAILURE, payload: error };
}

export function logOut() {
  return { type: actionTypes.LOGOUT };
}

export function logOutSuccess() {
  return { type: actionTypes.LOGOUT_SUCCESS };
}
