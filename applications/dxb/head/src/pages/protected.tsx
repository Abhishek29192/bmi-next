import * as React from "react";
import { WindowLocation } from "@reach/router";
import { AuthService, useAuth } from "@bmi/gatsby-theme-auth0";

interface Props {
  location: WindowLocation;
}

const ProtectedPage: React.FunctionComponent<Props> = (props) => {
  const { isLoggedIn, profile } = useAuth();

  React.useEffect(() => {
    if (!isLoggedIn) {
      console.log(
        "---- user is NOT logged in :: automatically signin in user ----"
      );
      AuthService.login();
      // tried this method but it doid not work!
      // const result = Promise.resolve(AuthService.checkSession());
      // if (!result) {
      //   console.log("-------- check session result ---------");
      //   console.log(result);
      //   AuthService.login();
      // }
    }
  }, [isLoggedIn]);

  return !isLoggedIn ? (
    <div style={{ margin: "10px" }}>
      This is protected page. Logging you in. Please wait..
    </div>
  ) : (
    profile && (
      <>
        <p>Hello {profile.name}</p>
        <a href="http://localhost:3000/protected">Go to Intouch site</a>
      </>
    )
  );
};

export default ProtectedPage;
