import {
  GET_OPERATORS_REQUEST,
  GET_OPERATORS_SUCCESS,
  GET_OPERATORS_FAIL,
  CLEAR_ERRORS,
} from "./constants";

const OperatorReducer = (state = {}, action: any) => {
  switch (action.type) {
    case GET_OPERATORS_REQUEST:
      return { ...state, loading: true };
    case GET_OPERATORS_SUCCESS:
      return { loading: false, operators: action.payload };
    case GET_OPERATORS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export { OperatorReducer };
