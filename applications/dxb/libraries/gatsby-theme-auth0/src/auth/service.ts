import * as process from "process";
import * as auth0 from "auth0-js";
import { navigate } from "gatsby";
import { getPathWithCountryCode } from "@bmi/head/src/utils/path";
import { config } from "./config";

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
  public isBrowser = typeof window !== "undefined";
  public auth0 = process.env.AUTH0_DOMAIN
    ? new auth0.WebAuth(config)
    : undefined;

  public authorize = process.env.AUTH0_DOMAIN
    ? new auth0.Authentication(config)
    : undefined;

  public logoutUri = process.env.AUTH0_LOGOUT_URL;

  public redirectDirectlyToLogin = () => {
    if (this.auth0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.auth0.authorize({ market: process.env.SPACE_MARKET_CODE });
    }
  };

  public login = () => {
    if (!this.isBrowser) {
      return;
    }
    // Save postLoginUrl so we can redirect user
    // back to where they left off after login screen
    localStorage.setItem("postLoginUrl", window.location.pathname);
    this.redirectDirectlyToLogin();
  };

  public handleAuthentication = (): Promise<auth0.Auth0DecodedHash | null> =>
    new Promise<auth0.Auth0DecodedHash | null>((resolve, reject): void => {
      this.auth0 &&
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
            const isEmailVerified = authResult.idTokenPayload.email_verified;
            if (!isEmailVerified) {
              localStorage.setItem("isLoggedIn", "false");
              if (process.env.GATSBY_SITE_URL) {
                const verifyUrl = getPathWithCountryCode(
                  process.env.SPACE_MARKET_CODE as string,
                  "verify-email"
                );
                const logoutUrl = `${process.env.GATSBY_SITE_URL}${verifyUrl}`;
                this.auth0?.logout({
                  returnTo: logoutUrl
                });
              }
            } else {
              const postLoginUrl = localStorage.getItem("postLoginUrl");
              if (postLoginUrl) {
                const urlToNavigate = postLoginUrl.includes("verify-email")
                  ? getPathWithCountryCode(
                      process.env.SPACE_MARKET_CODE as string,
                      ""
                    )
                  : postLoginUrl;

                navigate(urlToNavigate);
              }
              localStorage.removeItem("postLoginUrl");
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

  public setSession(authResult: auth0.Auth0DecodedHash): void {
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

    this.localLogout();
    this.auth0 &&
      this.auth0.logout({
        returnTo: this.logoutUri
      });
    localStorage.setItem("isAlreadyShownAlert", "false");
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
