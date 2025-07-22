// saga.js
import { all, put, call, takeEvery } from "redux-saga/effects";
import {
  actionTypes,
  loginSuccess,
  loginFailure,
  logOutSuccess,
} from "./action";
import Cookies from "js-cookie";
import Router from "next/router";
import { notification } from "antd";
import axios from "axios";
import CryptoJS from "crypto-js";
import { decryptData, encryptData } from "~/components/utils/crypto";


const LoginFunction = async (payload)=>(await axios.post('/api/login',payload));


function* loginSaga(action) {

  try {
    const payload = {
      email: action.payload.email,
      password: action.payload.password,
      magicLink: action?.payload?.magicLink || '',
    };
    // const response = await axios.post('/api/login',payload)
    const response = yield call(LoginFunction, payload);


    if (response.status !== 200) {
      throw new Error(response?.message || "Login failed");
    }

    const data = response.data;

    if (data.token) {
      const expiryTimeInHours = 10;
      const expiryTime = 10 / 24;
      const tokenExpirationTime = expiryTimeInHours * 60 * 60 * 1000;
      const currentTime = Date.now();
      Cookies.set("tokenExpiryTime", currentTime + tokenExpirationTime, {
        expires: 10 / 24,
      });
      Cookies.set("token", data.token, { expires: expiryTime });
      Cookies.set("fullName", data.fullName, { expires: expiryTime });
      Cookies.set("roleID", data.roleID, { expires: expiryTime });
      Cookies.set("tokenOMS", data.omsToken, { expires: expiryTime });
      Cookies.set("tokenF", data.tokenF || "", { expires: expiryTime });
      Cookies.set("fdetail", data.fdetail || "0", { expires: expiryTime });
      if (typeof data?.loginAttempt === "number") {
          const att = encryptData(data.loginAttempt);
          Cookies.set("g2adtag", att, { expires: expiryTime });
      }
      
      const payload={
        token:data.token,
        fullName:data.fullName,
        roleID: data.roleID,
      }
      yield put(loginSuccess(payload));
        if (data?.loginAttempt === 0) {
          Router.push("/login/new-user");
          console.log('----')

        }else{
                    Router.push("/");
        }

    } else {
      throw new Error("Login Failed");
      
    }
  } catch (error) {
    console.error(error);
    
    yield put(loginFailure("Login Failed" || error.message));
    notification.error({
      message: error.message || "Login Failed",
      description: error.message,
    });
    Router.push('/login')
  }
}

function* logOutSaga() {

  try {
    Cookies.remove("token", { path: "/" }); // Add domain if it was set: { path: '/', domain: '.yourdomain.com' }
    Cookies.remove("tokenExpiryTime", { path: "/" });
    Cookies.remove("fullName", { path: "/" });
    Cookies.remove("tokenOMS", { path: "/" });
    Cookies.remove("roleID", { path: "/" });
    Cookies.remove("g2adtag", { path: "/" });
    Cookies.remove("fdetail", { path: "/" });
    yield put(logOutSuccess());
    Router.push("/login");
    notification.warning({
      message: "Logged Out",
      description: "You have been logged out.",
    });
  } catch (error) {
    console.error(error);
        notification.warning({
      message: "Logged Out",
      description: "Error Loggoing OUT",
    });
  }
}

function* CheckLogin() {
  const tokenExpiryTime = Cookies.get("tokenExpiryTime");
  const token = Cookies.get("token");
  const fullName = Cookies.get("fullName");
  const roleID = Cookies.get("roleID");
  const loginAttempt = Cookies.get("g2adtag");

  
  
  if (tokenExpiryTime && token && fullName) {
    if (decryptData(loginAttempt) === 0) {
      Router.push("/login/new-user");
    }
    const currentTime = Date.now();
    if (currentTime >= parseInt(tokenExpiryTime)) {
            notification.warning({
        message: "Logged Out",
        description: "Session Expired.",
      });
      yield put(logOut()); // Dispatch LOGOUT action if the token has expired
      
      Router.push("/login"); // Redirect to the home page

    } else {
      const payload={
        token:token,
        fullName:fullName,
        roleID:roleID
      }
      yield put(loginSuccess(payload)); // Dispatch LOGIN_SUCCESS action with the token
    }
  } else {
    Router.push("/login"); // Redirect to the home page if no token is found
  }
}
export default function* rootSaga() {
  yield all([
    takeEvery(actionTypes.CHECK_LOGIN, CheckLogin),
    takeEvery(actionTypes.LOGIN_REQUEST, loginSaga),
    takeEvery(actionTypes.LOGOUT, logOutSaga),
  ]);
}
