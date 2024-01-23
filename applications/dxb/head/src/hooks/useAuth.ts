import React from "react";
import auth, { SessionState } from "../auth/service";
import type { Auth0IdTokenPayload } from "../types/auth0";

export type useAuthType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  profile: Auth0IdTokenPayload | undefined;
};

const useAuth = (
  stateCallback = (_state: SessionState) => {
    // no-op
  }
): useAuthType => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(auth.isAuthenticated());
  const [profile, setProfile] = React.useState<Auth0IdTokenPayload | undefined>(
    auth.getUserProfile()
  );

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
