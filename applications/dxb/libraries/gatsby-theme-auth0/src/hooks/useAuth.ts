import * as React from "react";
import { Auth0UserProfile } from "auth0-js";
import auth, { SessionState } from "../auth/service";

export type useAuthType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  profile: Auth0UserProfile | undefined;
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const useAuth = (stateCallback = (_state: SessionState) => {}): useAuthType => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(auth.isAuthenticated());
  const [profile, setProfile] = React.useState(auth.getUserProfile());

  React.useEffect(() => {
    // Override `sessionStateCallback` in auth service
    auth.sessionStateCallback = (state) => {
      stateCallback(state);
      setIsLoggedIn(state.isLoggedIn);
    };

    (async () => {
      await auth.checkSession();
      try {
        const user = auth.getUserProfile();
        setProfile(user);
      } catch (error) {
        console.error(`Error: ${error}`);
      }

      setIsLoading(false);
    })();

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      auth.sessionStateCallback = () => {};
    };
  }, []);

  return {
    isLoading,
    isLoggedIn,
    profile
  };
};

export default useAuth;
