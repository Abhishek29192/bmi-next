import React from "react";
import { AuthService, useAuth } from "@bmi/gatsby-theme-auth0";
import { Button } from "@bmi-digital/components";
import { LoginBlockStyles } from "./styles/LoginBlock";
import LoginAlert from "./LoginAlert";

const LoginBlock = () => {
  const { isLoggedIn, profile } = useAuth();

  return (
    <LoginBlockStyles>
      <LoginAlert />
      {isLoggedIn && profile && (
        <Button variant="text" className="account">
          My account
        </Button>
      )}
      {isLoggedIn ? (
        <Button onClick={AuthService.logout} variant="text">
          Logout
        </Button>
      ) : (
        <Button onClick={AuthService.login} variant="text">
          Login
        </Button>
      )}
    </LoginBlockStyles>
  );
};

export default LoginBlock;
