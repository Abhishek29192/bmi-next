import { Account } from "@bmi/intouch-api-types";

export const userRegistration = (resolvedUrl, user: Account) => {
  const { firstName, lastName } = user;
  if (resolvedUrl !== "/user-registration" && (!firstName || !lastName)) {
    return {
      redirect: {
        permanent: false,
        destination: "/user-registration"
      }
    };
  }

  return null;
};
