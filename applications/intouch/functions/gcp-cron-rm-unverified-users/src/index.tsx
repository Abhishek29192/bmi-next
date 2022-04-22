import { parseJSON, differenceInSeconds } from "date-fns";
import Auth0Client from "./Auth0Client";

type User = {
  email_verified: boolean;
  created_at: string;
  user_id: string;
  email: string;
};

export const removeAuth0UnverifiedAccount = async (
  postEvent?: any,
  context?: any
) => {
  const { AUTH0_INVITATION_LIFETIME } = process.env;
  const auth0 = new Auth0Client();
  try {
    const users: User[] = await auth0.getUnverifiedUser();

    if (users && users.length) {
      const invitationExpiredUser = users.filter(
        ({ created_at: createdAt }) => {
          return (
            differenceInSeconds(new Date(), parseJSON(createdAt)) >
            parseInt(AUTH0_INVITATION_LIFETIME)
          );
        }
      );

      if (invitationExpiredUser.length) {
        const promises = invitationExpiredUser.map(
          ({ user_id: userId, email }) =>
            auth0.deleteUser({ id: userId, email })
        );
        await Promise.allSettled(promises).then((value) => {
          const rejected = value.filter(({ status }) => status === "rejected");
          if (rejected.length) {
            const message = rejected.map((value) => (value as any).reason);
            throw message;
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
