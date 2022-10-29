import React, { FC } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface AuthStateProps {
  loading?: boolean;
  auth?: any;
  user?: any;
  authenticated?: boolean;
  error: any;
}

interface DefaultProps {
  isAdmin?: boolean;
}

const ProtectedRoutes: FC<DefaultProps> = ({ isAdmin }: DefaultProps) => {
  const { loading, authenticated, user, error }: AuthStateProps = useSelector(
    (state: AuthStateProps) => state.auth
  );

  if (!loading && authenticated === false) {
    return <Navigate to={"/login"} />;
  }
  
  if(isAdmin === true && user.role !== "admin") {
    return <Navigate to={"/home"} />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
