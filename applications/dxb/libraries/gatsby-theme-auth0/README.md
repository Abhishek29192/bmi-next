## Usage
```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "@bmi/gatsby-theme-auth0",
      options: {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        redirectUri: process.env.AUTH0_CALLBACK_URL,
        // audience: process.env.AUTH0_AUDIENCE, // Optional
        // responseType: process.env.AUTH0_RESPONSE_TYPE, // Optional
        // scope: process.env.AUTH0_SCOPE, // Optional
        // callbackPath: "/auth/callback", // Optional
        logoutUri: process.env.AUTH0_LOGOUT_URL
      }
    }
  ]
};
```

Set up your login/logout buttons and you're good to go!

```jsx
import React from "react";
import { AuthService, useAuth } from "@bmi/gatsby-theme-auth0";

export default () => {
  const { isLoggedIn, profile } = useAuth();
  return (
    <div>
      {profile && <p>Hello {profile.name}</p>}
      {isLoggedIn ? (
        <button onClick={AuthService.logout}>Logout</button>
      ) : (
        <button onClick={AuthService.login}>Login</button>
      )}
    </div>
  );
};
```
