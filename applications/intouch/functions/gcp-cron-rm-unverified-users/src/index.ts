import { parseJSON, differenceInSeconds } from "date-fns";
import Auth0Client from "./Auth0Client";

type User = {
  email_verified: boolean;
  created_at: string;
  user_id: string;
  email: string;
};

type GetUnverifiedUser = { users: User[]; total: number; length: number };

export const removeAuth0UnverifiedAccount = async (
  postEvent?: any,
  context?: any
) => {
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
      console.log(`succesfully fetched uninvited ${userList.length} users`);
      const invitationExpiredUser = userList.filter(
        ({ created_at: createdAt }) => {
          return (
            differenceInSeconds(new Date(), parseJSON(createdAt)) >
            parseInt(AUTH0_INVITATION_LIFETIME)
          );
        }
      );

      if (invitationExpiredUser.length) {
        const pending = invitationExpiredUser.map(
          ({ user_id: userId, email }) => ({ id: userId, email })
        );
        while (pending.length) {
          //limit call to 2 to avoid too many request
          const userInfo = pending.splice(0, 2);
          await Promise.allSettled([
            ...userInfo.map((user) => auth0.deleteUser(user))
          ]).then((value) => {
            value.map(({ status }: any, id) => {
              if (status === "fulfilled") {
                console.log(
                  `successfully deleted user with email ${
                    userInfo[`${id}`].email
                  } auth0 Id: ${userInfo[`${id}`].id}`
                );
              }
            });
          });
          // delay call to avoid rate limit
          await new Promise((resolve) =>
            setTimeout(() => resolve("delayed"), 1000)
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
