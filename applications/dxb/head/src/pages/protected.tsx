import * as React from "react";
import { WindowLocation } from "@reach/router";
import { AuthService, useAuth } from "@bmi/gatsby-theme-auth0";

interface Props {
  location?: WindowLocation;
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
