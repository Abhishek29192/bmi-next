import React from "react";
import { AuthService, useAuth } from "@bmi/gatsby-theme-auth0";
import { Button } from "@bmi-digital/components";
import { microCopy } from "@bmi/microcopies";
import { LoginBlockStyles } from "./styles/LoginBlock";
import { useSiteContext } from "./Site";

const LoginBlock = () => {
  const { isLoggedIn, profile } = useAuth();
  const { getMicroCopy } = useSiteContext();

  return (
    <LoginBlockStyles>
      {isLoggedIn && profile && (
        <Button variant="text" className="account">
          {getMicroCopy(microCopy.MY_ACCOUNT_LABEL)}
        </Button>
      )}
      {isLoggedIn ? (
        <Button onClick={AuthService.logout} variant="text">
          {getMicroCopy(microCopy.LOG_OUT_LABEL_BTN)}
        </Button>
      ) : (
        <Button onClick={AuthService.login} variant="text">
          {getMicroCopy(microCopy.LOG_IN_LABEL_BTN)}
        </Button>
      )}
    </LoginBlockStyles>
  );
};

export default LoginBlock;
