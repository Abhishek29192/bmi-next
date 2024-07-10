import auth0 from "auth0-js";
import { navigate } from "gatsby";
import { config } from "./config";
import type { Auth0IdTokenPayload } from "../types/auth0";
import type { AuthorizeOptions } from "auth0-js";

export interface SessionState {
  isLoggedIn: boolean;
  userProfile?: Auth0IdTokenPayload;
  accessToken?: string;
  idToken?: string;
}

class Auth {
  private accessToken?: string;
  private idToken?: string;
  private userProfile?: Auth0IdTokenPayload;

  public sessionStateCallback = (_state: SessionState) => {};

  private auth0 = process.env.GATSBY_AUTH0_DOMAIN
    ? new auth0.WebAuth(config)
    : undefined;

  private logoutUri = process.env.GATSBY_AUTH0_LOGOUT_URL!;
  private isBrowser = typeof window !== "undefined";

  public login = () => {
    if (!this.isBrowser) {
      return;
    }
    // Save postLoginUrl so we can redirect user back to where they left off
    // after login screen
    localStorage.setItem("postLoginUrl", window.location.pathname);
    localStorage.removeItem("showLoginToast");
    localStorage.removeItem("showLogoutToast");
    this.auth0 &&
      this.auth0.authorize({
        market: process.env.GATSBY_SPACE_MARKET_CODE
      } as unknown as AuthorizeOptions);
  };

  public handleAuthentication = (): Promise<auth0.Auth0DecodedHash | null> =>
    new Promise<auth0.Auth0DecodedHash | null>((resolve, reject): void => {
      this.auth0 &&
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);

            const postLoginUrl = localStorage.getItem("postLoginUrl");
            localStorage.removeItem("postLoginUrl");
            localStorage.setItem("showLoginToast", "true");
            if (postLoginUrl) {
              navigate(postLoginUrl);
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

  public getUserProfile = (): Auth0IdTokenPayload | undefined =>
    this.userProfile;

  private setSession(authResult: auth0.Auth0DecodedHash) {
    if (!this.isBrowser) {
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

  public checkSession = (): Promise<auth0.Auth0DecodedHash | null> =>
    new Promise<auth0.Auth0DecodedHash | null>((resolve) => {
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
          return resolve(null);
        });
    });

  public localLogout = () => {
    if (!this.isBrowser) {
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
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem("showLogoutToast", "true");
    this.localLogout();
    this.auth0 &&
      this.auth0.logout({
        returnTo: this.logoutUri
      });
  };

  public isAuthenticated = () => {
    if (!this.isBrowser) {
      return false;
    }
    return localStorage.getItem("isLoggedIn") === "true";
  };
}

const auth = new Auth();

export default auth;
