import * as React from "react";
import { WindowLocation } from "@reach/router";
import { AuthService, useAuth } from "@bmi/gatsby-theme-auth0";

interface Props {
  location?: WindowLocation;
  children?: React.ReactNode;
}

const ProtectedPage: React.FunctionComponent<Props> = ({ children }) => {
  const { isLoggedIn, profile } = useAuth();

  React.useEffect(() => {
    if (!isLoggedIn) {
      AuthService.login();
    }
  }, [isLoggedIn]);

  return !isLoggedIn || !profile ? null : <>{children}</>;
};

export default ProtectedPage;
