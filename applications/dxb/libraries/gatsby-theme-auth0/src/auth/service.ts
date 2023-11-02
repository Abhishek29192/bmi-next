import * as process from "process";
import * as auth0 from "auth0-js";
import { navigate } from "gatsby";
import { config } from "./config";

const isBrowser = typeof window !== "undefined";

export interface SessionState {
  isLoggedIn: boolean;
  userProfile?: auth0.Auth0UserProfile;
  accessToken?: string;
  idToken?: string;
}

class Auth {
  private accessToken?: string;
  private idToken?: string;
  private userProfile?: auth0.Auth0UserProfile;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public sessionStateCallback = (_state: SessionState) => {};

  private auth0 = process.env.AUTH0_DOMAIN
    ? new auth0.WebAuth(config)
    : undefined;

  private logoutUri = process.env.AUTH0_LOGOUT_URL;

  public login = () => {
    if (!isBrowser) {
      return;
    }
    // Save postLoginUrl so we can redirect user back to where they left off after login screen
    localStorage.setItem("postLoginUrl", window.location.pathname);
    if (this.auth0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.auth0.authorize({ market: process.env.SPACE_MARKET_CODE });
    }
  };

  public handleAuthentication = () =>
    new Promise((resolve, reject) => {
      this.auth0 &&
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);

            const postLoginUrl = localStorage.getItem("postLoginUrl");
            localStorage.removeItem("postLoginUrl");
            if (postLoginUrl) {
              localStorage.setItem("isAlreadyShownAlert", "false");
              navigate(postLoginUrl, { state: { needToShowAlert: true } });
            }

            return resolve(authResult);
          } else if (err) {
            return reject(err);
          }
          return resolve(null);
        });
    });

  public getAccessToken = () => this.accessToken;

  public getIdToken = () => this.idToken;

  public getUserProfile = () => this.userProfile;

  private setSession(authResult: auth0.Auth0DecodedHash) {
    if (!isBrowser) {
      return;
    }
    localStorage.setItem("isLoggedIn", "true");
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.userProfile = authResult.idTokenPayload;
    this.sessionStateCallback({
      isLoggedIn: true,
      userProfile: this.userProfile,
      accessToken: this.accessToken,
      idToken: this.idToken
    });
  }

  public checkSession = () =>
    new Promise<void>((resolve) => {
      this.auth0 &&
        this.auth0.checkSession({}, (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
            return resolve(authResult);
          }
          if (err && err.error === "login_required") {
            // User has been logged out from Auth0 server.
            // Remove local session.
            this.localLogout();
          }
          return resolve();
        });
    });

  public localLogout = () => {
    if (!isBrowser) {
      return;
    }
    // Remove tokens and user profile
    this.accessToken = undefined;
    this.idToken = undefined;
    this.userProfile = undefined;

    localStorage.removeItem("isLoggedIn");
    this.sessionStateCallback({
      isLoggedIn: false,
      userProfile: undefined,
      accessToken: undefined,
      idToken: undefined
    });
  };

  public logout = () => {
    if (!isBrowser) {
      return;
    }

    this.localLogout();
    this.auth0 &&
      this.auth0.logout({
        returnTo: this.logoutUri
      });
    localStorage.setItem("isAlreadyShownAlert", "false");
  };

  public isAuthenticated = () => {
    if (!isBrowser) {
      return false;
    }
    return localStorage.getItem("isLoggedIn") === "true";
  };
}

const auth = new Auth();

export default auth;
