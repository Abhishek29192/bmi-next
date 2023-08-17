// import React from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { Button } from "@bmi-digital/components";

// function LoginButton() {
//   const { isAuthenticated, loginWithRedirect } = useAuth0();

//   return (
//     !isAuthenticated && (
//       <Button onClick={loginWithRedirect} style={{ margin: "36px" }}>
//         Log in
//       </Button>
//     )
//   );
// }

// export default LoginButton;

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
