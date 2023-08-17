import * as React from "react";
import { WindowLocation } from "@reach/router";
import { AuthService } from "gatsby-theme-auth0";

interface Props {
  location: WindowLocation;
}

const CallbackPage: React.FunctionComponent<Props> = (props) => {
  const { location } = props;

  React.useEffect(() => {
    if (/access_token|id_token|error/.test(location.hash)) {
      AuthService.handleAuthentication();
    }
  }, [location.hash]);

  return <>Logging in</>;
};

export default CallbackPage;
