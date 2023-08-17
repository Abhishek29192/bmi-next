import React from "react";
import { AuthService, useAuth } from "gatsby-theme-auth0";
import { Button } from "@bmi-digital/components";

function LoginButton() {
  const { isLoggedIn, profile } = useAuth();
  return (
    <div style={{ margin: "32px" }}>
      {profile && <p>Hello {profile.name}</p>}
      {isLoggedIn ? (
        <Button onClick={AuthService.logout}>Logout</Button>
      ) : (
        <Button onClick={AuthService.login}>Login</Button>
      )}
    </div>
  );
}

export default LoginButton;
