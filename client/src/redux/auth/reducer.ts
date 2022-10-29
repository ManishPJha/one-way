import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAIL,
  CLEAR_ERRORS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
} from "./constants";

const initState = {
  loading: false,
  authenticated: false,
  user: []
}

export const authReducer = (state = initState, action: any) => {
  switch (action.type) {
    case AUTH_REQUEST:
    case LOGIN_REQUEST:
    case LOGOUT_REQUEST:
      return { ...state, loading: true };
    case AUTH_SUCCESS:
    case LOGIN_SUCCESS:
      return { loading: false, authenticated: true, user: action.payload };
    case LOGOUT_SUCCESS:
      return { ...state, loading: false, authenticated: false, user: [] };
    case AUTH_FAIL:
    case LOGIN_FAIL:
    case LOGOUT_FAIL:
      return { loading: false, authenticated: false, error: action.error };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
