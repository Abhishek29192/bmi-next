import React from "react";
import AuthService from "../auth/service";
import useAuth from "../hooks/useAuth";

interface Props {
  children?: React.ReactNode;
}

const ProtectedPage: React.FunctionComponent<Props> = ({ children }) => {
  const { isLoggedIn, profile, isLoading } = useAuth();
  React.useEffect(() => {
    if (!isLoggedIn && !isLoading && !profile) {
      AuthService.login();
    }
  }, [isLoading, isLoggedIn, profile]);

  return profile && <>{children}</>;
};

export default ProtectedPage;
