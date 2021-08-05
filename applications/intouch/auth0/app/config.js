"use strict";

module.exports = (market) => {
  return Buffer.from(
    unescape(
      encodeURIComponent(
        JSON.stringify({
          assetsUrl: "",
          auth0Domain: "intouch-dev.eu.auth0.com",
          auth0Tenant: "intouch-dev",
          clientConfigurationBaseUrl: "https://cdn.eu.auth0.com/",
          callbackOnLocationHash: false,
          callbackURL: "https://intouch.dddev.io/api/auth/callback",
          cdn: "https://cdn.auth0.com/",
          clientID: "W4gH2YagDOBdMpEUESoC4xZhsZbc3W1S",
          dict: {
            signin: { title: "Nextjs" }
          },
          extraParams: {
            protocol: "oauth2",
            scope: "openid profile email",
            response_type: "code",
            audience: "https://dev-api.intouch.dev",
            market: market,
            nonce: "ALZ9FYhN7sAOsA1KUeu7NCIkwD2qOvkgmaB7PM9CQKc",
            code_challenge: "xHbzDkqkioUSF57rrM6I8ivfJjKH3icpekeC3np5hN4",
            code_challenge_method: "S256",
            _csrf: "J26TXsEP-5YuBNJEaDuZGUZAQIVEpNU_t3fs",
            _intstate: "deprecated",
            state:
              "hKFo2SA3clZrU2ZCOUNydDByX2d6YTdPTDJmczJaRmUwLXR6RaFupWxvZ2luo3RpZNkgWG9ZVWJtaDdlSTAwLU5hWW8tZlVTaDlFYkZ5ODNpWlmjY2lk2SBXNGdIMllhZ0RPQmRNcEVVRVNvQzR4WmhzWmJjM1cxUw"
          },
          internalOptions: {
            protocol: "oauth2",
            scope: "openid profile email",
            response_type: "code",
            audience: "https://dev-api.intouch.dev",
            market: market,
            nonce: "ALZ9FYhN7sAOsA1KUeu7NCIkwD2qOvkgmaB7PM9CQKc",
            code_challenge: "xHbzDkqkioUSF57rrM6I8ivfJjKH3icpekeC3np5hN4",
            code_challenge_method: "S256",
            _csrf: "J26TXsEP-5YuBNJEaDuZGUZAQIVEpNU_t3fs",
            _intstate: "deprecated",
            state:
              "hKFo2SA3clZrU2ZCOUNydDByX2d6YTdPTDJmczJaRmUwLXR6RaFupWxvZ2luo3RpZNkgWG9ZVWJtaDdlSTAwLU5hWW8tZlVTaDlFYkZ5ODNpWlmjY2lk2SBXNGdIMllhZ0RPQmRNcEVVRVNvQzR4WmhzWmJjM1cxUw"
          },
          widgetUrl: "https://cdn.auth0.com/w2/auth0-widget-5.1.min.js",
          isThirdPartyClient: false,
          authorizationServer: {
            url: "https://intouch-dev.eu.auth0.com",
            issuer: "https://intouch-dev.eu.auth0.com/"
          },
          colors: { page_background: "#000000", primary: "#ea5323" }
        })
      )
    )
  ).toString("base64");
};
