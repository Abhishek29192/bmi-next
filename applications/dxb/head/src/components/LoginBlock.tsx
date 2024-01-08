import Button from "@bmi-digital/components/button";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import AuthService from "../auth/service";
import useAuth from "../hooks/useAuth";
import { getPathWithCountryCode } from "../utils/path";
import { useSiteContext } from "./Site";
import { LoginBlockStyles } from "./styles/LoginBlock";

const LoginBlock = () => {
  const { isLoggedIn, profile } = useAuth();
  const { getMicroCopy, countryCode, accountPage } = useSiteContext();

  return (
    <LoginBlockStyles>
      {isLoggedIn && profile && (
        <div className="account">
          <Button
            variant="text"
            data-testid="my-acc"
            action={{
              model: "htmlLink",
              href: getPathWithCountryCode(countryCode, accountPage?.slug)
            }}
          >
            {getMicroCopy(microCopy.MY_ACCOUNT_LABEL)}
          </Button>
        </div>
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
          onClick={() => {
            AuthService.login();
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
