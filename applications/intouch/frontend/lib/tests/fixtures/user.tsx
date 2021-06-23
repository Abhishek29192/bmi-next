import React from "react";
import { UserProvider, UserProfile } from "@auth0/nextjs-auth0";

const user: UserProfile = {
  nickname: "joe",
  name: "joe@email.invalid",
  picture:
    "https://s.gravatar.com/avatar/3ef7eeca4f238cf3a49170d87376bc81?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fdo.png",
  updated_at: "2021-06-08T15:28:05.034Z",
  email: "joe@email.invalid",
  email_verified: true,
  sub: "auth0|101eeg52287a6c00688802dc"
};

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default Provider;
