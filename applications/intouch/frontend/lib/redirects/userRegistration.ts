import { Account } from "@bmi/intouch-api-types";
import { Session } from "@auth0/nextjs-auth0";

export const userRegistration = (
  resolvedUrl,
  account: Account,
  session: Session
) => {
  const { firstName, lastName } = account;
  const termsToAccept =
    session.user[`${process.env.AUTH0_NAMESPACE}/terms_to_accept`];

  if (
    resolvedUrl !== "/user-registration" &&
    (!firstName || !lastName || termsToAccept)
  ) {
    return {
      redirect: {
        permanent: false,
        destination: "/user-registration"
      }
    };
  }

  return null;
};
