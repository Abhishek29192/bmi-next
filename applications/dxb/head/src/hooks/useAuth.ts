import { Auth0UserProfile } from "auth0-js";
import React from "react";
import auth, { SessionState } from "../auth/service";

export type useAuthType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  profile: Auth0UserProfile | undefined;
};

const useAuth = (
  stateCallback = (_state: SessionState) => {
    // no-op
  }
): useAuthType => {
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
      // Clean up sessionStateCallback
      auth.sessionStateCallback = () => {
        // no-op
      };
    };
  }, []);

  return {
    isLoading,
    isLoggedIn,
    profile
  };
};

export default useAuth;
