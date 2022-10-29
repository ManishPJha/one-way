import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadUser } from "../redux/auth/action";

interface AuthStateProps {
  loading?: boolean;
  auth?: any;
  user?: object;
  authenticated?: boolean;
  error: any;
}

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { loading, authenticated, user, error }: AuthStateProps = useSelector(
    (state: AuthStateProps) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  useEffect(() => {
    // if (authenticated) setIsAuthenticated(true);
    if(authenticated && authenticated === true) {
      setIsAuthenticated(true)
    }
    
  }, [authenticated]);

  return [isAuthenticated];
};

export default useAuth;
