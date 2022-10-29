import API from "../API";
import { API_URI } from "../../lib/helper";
import {
  ADD_EMPLOYEE_REQUEST,
  ADD_EMPLOYEE_RESPONSE,
  ADD_EMPLOYEE_FAIL,
  GET_EMPLOYEES_REQUEST,
  GET_EMPLOYEES_RESPONSE,
  GET_EMPLOYEES_FAIL,
  GET_EMPLOYEE_REQUEST,
  GET_EMPLOYEE_RESPONSE,
  GET_EMPLOYEE_FAIL,
  UPDATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_RESPONSE,
  UPDATE_EMPLOYEE_FAIL,
  REMOVE_EMPLOYEE_REQUEST,
  REMOVE_EMPLOYEE_RESPONSE,
  REMOVE_EMPLOYEE_FAIL,
  CLEAR_ERRORS,
} from "./constants";

const options = {
  withCredentials: true,
};

interface EmployeeDataProps {
  name?: string;
  lastName?: string;
  dob?: Date;
  email?: string;
  image?: string;
  qualifications?: string;
  residents?: any;
  isSalaried?: boolean;
  isIntern?: boolean;
  trainingDuration?: Date;
  bondDuration?: Date;
}

const getEmployees: Function = () => async (dispatch: any) => {
  dispatch({ type: GET_EMPLOYEES_REQUEST });
  try {
    const Employees = await API.get(
      API_URI + "/employee/getAllEmployees",
      options
    );
    if (Employees.data.success === true) {
      dispatch({ type: GET_EMPLOYEES_RESPONSE, payload: Employees.data.data });
    }
  } catch (error: any) {
    console.log(">>> ERROR:", error.message);
    dispatch({
      type: GET_EMPLOYEES_FAIL,
      payload: error.response.data.message,
    });
  }
};

const getEmployeeWithId: Function = (id: any) => async (dispatch: any) => {
  dispatch({ type: GET_EMPLOYEE_REQUEST });
  try {
    const Employees = await API.get(API_URI + `/employee/${id}`);
    if (Employees.data.success === true) {
      dispatch({ type: GET_EMPLOYEE_RESPONSE, payload: Employees.data.data });
    }
  } catch (error: any) {
    console.log(">>> ERROR:", error.message);
    dispatch({
      type: GET_EMPLOYEE_FAIL,
      payload: error.response.data.errorMessage,
    });
  }
};

// Add Employee
const addEmployee: Function = (data: any) => async (dispatch: any) => {
  dispatch({ type: ADD_EMPLOYEE_REQUEST });
  try {
    const Employee = await API.post(API_URI + "/employee/addEmployee", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (Employee.data.success === true) {
      dispatch({ type: ADD_EMPLOYEE_RESPONSE, payload: Employee.data.data });
    }
  } catch (error: any) {
    console.log(">>> ERROR:", error.message);
    dispatch({
      type: ADD_EMPLOYEE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Employee
const updateEmployeeWithId: Function =
  (id: any, data: EmployeeDataProps) => async (dispatch: any) => {
    dispatch({ type: UPDATE_EMPLOYEE_REQUEST });
    try {
      const Employee = await API.put(
        API_URI + "/employee/" + id,
        data,
        options
      );
      if (Employee.data.success === true) {
        dispatch({
          type: UPDATE_EMPLOYEE_RESPONSE,
          payload: Employee.data.data,
        });
      }
    } catch (error: any) {
      console.log(">>> ERROR:", error.message);
      dispatch({
        type: UPDATE_EMPLOYEE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Clear Errors
const clearErrors: Function = () => async (dispatch: any) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

export {
  getEmployees,
  getEmployeeWithId,
  addEmployee,
  updateEmployeeWithId,
  clearErrors,
};
