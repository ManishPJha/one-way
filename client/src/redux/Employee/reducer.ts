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

export const employeeReducer = (state = {}, action: any) => {
  switch (action.type) {
    case GET_EMPLOYEE_REQUEST:
    case GET_EMPLOYEES_REQUEST:
    case ADD_EMPLOYEE_REQUEST:
    case UPDATE_EMPLOYEE_REQUEST:
    case REMOVE_EMPLOYEE_REQUEST:
      return { ...state, loading: true };

    case GET_EMPLOYEES_RESPONSE:
      return { loading: false, employees: action.payload };

    case ADD_EMPLOYEE_RESPONSE:
      return { ...state, loading: false, employee: action.payload };

    case GET_EMPLOYEE_RESPONSE:
    case UPDATE_EMPLOYEE_RESPONSE:
      return { ...state, loading: false, employee: action.payload };

    case GET_EMPLOYEE_FAIL:
    case GET_EMPLOYEES_FAIL:
    case ADD_EMPLOYEE_FAIL:
    case UPDATE_EMPLOYEE_FAIL:
    case REMOVE_EMPLOYEE_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};
