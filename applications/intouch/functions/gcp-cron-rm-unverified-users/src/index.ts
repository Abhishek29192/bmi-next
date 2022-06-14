import { differenceInSeconds } from "date-fns";
import logger from "@bmi-digital/functions-logger";
import Auth0Client from "./Auth0Client";

type User = {
  email_verified: boolean;
  created_at: string;
  user_id: string;
  email: string;
};

type GetUnverifiedUser = { users: User[]; total: number; length: number };

export const removeAuth0UnverifiedAccount = async () => {
  const { AUTH0_INVITATION_LIFETIME } = process.env;
  const auth0 = new Auth0Client();
  try {
    const { users, total, length }: GetUnverifiedUser =
      await auth0.getUnverifiedUser();
    let userList = [...users];

    while (userList.length < total) {
      const { users }: GetUnverifiedUser = await auth0.getUnverifiedUser(
        userList.length / length
      );
      userList = [...userList, ...users];

      await new Promise((resolve) =>
        setTimeout(() => resolve("delayed"), 1000)
      );
    }

    if (userList.length) {
      logger.info({
        message: `succesfully fetched unverified ${userList.length} users`
      });
      const invitationExpiredUser = userList.filter(
        ({ created_at: createdAt }) => {
          return (
            differenceInSeconds(new Date(), new Date(createdAt)) >
            parseInt(AUTH0_INVITATION_LIFETIME!)
          );
        }
      );
      logger.info({
        message: `${
          invitationExpiredUser.length
        } users are created over ${AUTH0_INVITATION_LIFETIME!}s`
      });

      while (invitationExpiredUser.length) {
        //limit call to 2 to avoid too many request
        const userInfo = invitationExpiredUser.splice(0, 2);
        await Promise.allSettled([
          ...userInfo.map(({ email }) => auth0.deleteUser({ email }))
        ]).then((value) => {
          value.map((result, id) => {
            if (result.status === "fulfilled") {
              logger.info({
                message: `successfully deleted user with email ${
                  userInfo[id as unknown as number].email
                } auth0 Id: ${userInfo[id as unknown as number].user_id}`
              });
            }
            if (result.status === "rejected") {
              logger.error({
                message: `failed to delete user with email ${
                  userInfo[id as unknown as number].email
                } auth0 Id: ${userInfo[id as unknown as number].user_id}, ${
                  result.reason
                }`
              });
            }
          });
        });
        // delay call to avoid rate limit
        await new Promise((resolve) =>
          setTimeout(() => resolve("delayed"), 1000)
        );
      }
    }
  } catch (error) {
    logger.error(error as any);
  }
};
