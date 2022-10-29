import { API_URI } from "../../lib/helper";
import API from "../API";

import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CLEAR_ERRORS,
} from "./constants";

const loginOperator: Function = (data: object) => async (dispatch: any) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const Operator = await API.post(API_URI + "/operator/login", data, {
      withCredentials: true,
    });
    dispatch({ type: LOGIN_SUCCESS, payload: Operator.data.operator });
  } catch (error: any) {
    console.log(">>> ERROR:", error.message);
    // if (error?.response?.data?.errorMessage)
      dispatch({ type: LOGIN_FAIL, error: error.response.data.message });
    // else dispatch({ type: LOGIN_FAIL, error: "Login Failed!" });
  }
};

const loadUser: Function = () => async (dispatch: any) => {
  try {
    dispatch({ type: AUTH_REQUEST });
    const User = await API.get(API_URI + "/operator/me");

    if (User.data.success === true) {
      dispatch({ type: AUTH_SUCCESS, payload: User.data.data });
    }
  } catch (error: any) {
    console.log(">>> ERROR:" + error.message);
    dispatch({ type: AUTH_FAIL, error: error.response.data.errorMessage });
  }
};

const logOut: Function = (alert: any) => async (dispatch: any) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
    const User = await API.get(API_URI + "/operator/logout", {
      withCredentials: true,
    });

    if (User.data.success === true) {
      dispatch({ type: LOGOUT_SUCCESS });
      alert.success("Logout Successfull.");
    }
  } catch (error: any) {
    console.log(">>> ERROR:" + error.message);
    dispatch({ type: AUTH_FAIL, error: error.message });
  }
};

// Clear Errors
const clearErrors: Function = () => async (dispatch: any) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

export { loadUser, loginOperator, logOut, clearErrors };
