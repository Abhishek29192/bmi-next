import Button from "@bmi-digital/components/button";
import { AuthService, useAuth } from "@bmi/gatsby-theme-auth0";
import { microCopy } from "@bmi/microcopies";
import { navigate } from "gatsby";
import React from "react";
import { getPathWithCountryCode } from "../utils/path";
import { useSiteContext } from "./Site";
import { LoginBlockStyles } from "./styles/LoginBlock";

const LoginBlock = () => {
  const { isLoggedIn, profile } = useAuth();
  const { getMicroCopy, countryCode } = useSiteContext();

  return (
    <LoginBlockStyles>
      {isLoggedIn && profile && (
        <Button
          variant="text"
          className="account"
          data-testid="ma-acc"
          onClick={() =>
            navigate(getPathWithCountryCode(countryCode, "my-account"))
          }
        >
          {getMicroCopy(microCopy.MY_ACCOUNT_LABEL)}
        </Button>
      )}
      {isLoggedIn ? (
        <Button
          onClick={AuthService.logout}
          variant="text"
          data-testid="logout"
        >
          {getMicroCopy(microCopy.LOG_OUT_LABEL_BTN)}
        </Button>
      ) : (
        <Button
          action={{
            model: "htmlLink",
            href: process.env.GATSBY_INTOUCH_LOGIN_ENDPOINT
          }}
          variant="text"
          data-testid="login"
        >
          {getMicroCopy(microCopy.LOG_IN_LABEL_BTN)}
        </Button>
      )}
    </LoginBlockStyles>
  );
};

export default LoginBlock;
