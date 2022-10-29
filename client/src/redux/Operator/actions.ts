import { API_URI } from "../../lib/helper";
import API from "../API";
import {
  GET_OPERATORS_FAIL,
  GET_OPERATORS_REQUEST,
  GET_OPERATORS_SUCCESS,
} from "./constants";

const options = {
  headers: {
    "Content-Type": "application/json",
  },
};

const getAllOperators: Function = () => async (dispatch: any) => {
  try {
    dispatch({ type: GET_OPERATORS_REQUEST });

    const Operator = await API.get(
      API_URI + "/operator/getAllOperators",
      options
    );

    // if (Operator.data.length > 0) {
    //   dispatch({ type: GET_OPERATORS_SUCCESS, payload: Operator.data });
    // }
  } catch (error: any) {
    console.log(
      ">>> ERROR:" + error.message + "\n >>>" + error?.response?.data?.message
    );
    dispatch({ type: GET_OPERATORS_FAIL, payload: error.message });
  }
};

export { getAllOperators };
