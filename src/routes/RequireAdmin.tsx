import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/services";
import { useLocaleQuery, withLocale } from "@/hooks/useLocaleQuery";

interface RequireAdminProps {
  children: React.ReactNode;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const location = useLocation();
  const { locale } = useLocaleQuery();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return null;

  if (!user || user.role !== "admin") {
    return (
      <Navigate
        to={withLocale("/", locale)}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
