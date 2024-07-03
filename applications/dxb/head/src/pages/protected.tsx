import React from "react";
import AuthService from "../auth/service";
import useAuth from "../hooks/useAuth";

interface Props {
  children?: React.ReactNode;
  isPageProtected?: boolean;
}

const ProtectedPage: React.FunctionComponent<Props> = ({
  children,
  isPageProtected
}) => {
  const { isLoggedIn, profile, isLoading } = useAuth();

  React.useEffect(() => {
    if (isPageProtected) {
      if (!isLoggedIn && !isLoading && !profile) {
        return AuthService.login();
      }
    }
  }, [isLoading, isLoggedIn, profile, isPageProtected]);

  return isPageProtected ? profile && <>{children}</> : <>{children}</>;
};

export default ProtectedPage;
