import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../public/PageLoader";

export interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, getRoleRedirectPath } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    const redirectPath = getRoleRedirectPath(user?.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
