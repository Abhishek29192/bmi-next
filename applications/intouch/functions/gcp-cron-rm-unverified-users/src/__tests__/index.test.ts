import { sub } from "date-fns";
import { Response } from "node-fetch";
import { removeAuth0UnverifiedAccount } from "..";
import Auth0Client from "../Auth0Client";
import { userFactory, userSearchIncludeTotalFactory } from "./utils/user";

process.env.AUTH0_INVITATION_LIFETIME = "432000";

const getUnverifiedUserSpy = jest.spyOn(
  Auth0Client.prototype,
  "getUnverifiedUser"
);
const deleteUserSpy = jest.spyOn(Auth0Client.prototype, "deleteUser");
const loggerError = jest.fn();
const loggerInfo = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  error: (message: any) => loggerError(message),
  info: (message: any) => loggerInfo(message)
}));

describe("removeAuth0UnverifiedAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("normal case", async () => {
    const result = userSearchIncludeTotalFactory();
    getUnverifiedUserSpy.mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy.mockImplementationOnce(() => Promise.resolve("ok"));

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfo).toHaveBeenNthCalledWith(1, {
      message: `succesfully fetched unverified 1 users`
    });
    expect(loggerInfo).toHaveBeenNthCalledWith(2, {
      message: `1 users are created over ${process.env.AUTH0_INVITATION_LIFETIME}s`
    });
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfo).toHaveBeenNthCalledWith(3, {
      message: `successfully deleted user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}`
    });
  });

  it("filter user smaller than auth0_invitation_lifetime env", async () => {
    const result = userSearchIncludeTotalFactory({}, [
      userFactory({
        created_at: sub(new Date(), {
          seconds: parseInt(process.env.AUTH0_INVITATION_LIFETIME!) - 10
        }).toISOString()
      })
    ]);
    getUnverifiedUserSpy.mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy.mockImplementationOnce(() => Promise.resolve("ok"));

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfo).toHaveBeenNthCalledWith(1, {
      message: `succesfully fetched unverified 2 users`
    });
    expect(loggerInfo).toHaveBeenNthCalledWith(2, {
      message: `1 users are created over ${process.env.AUTH0_INVITATION_LIFETIME}s`
    });
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfo).toHaveBeenNthCalledWith(3, {
      message: `successfully deleted user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}`
    });
    expect(loggerInfo).toHaveBeenCalledTimes(3);
  });

  it("multiple unverified user", async () => {
    const result = userSearchIncludeTotalFactory({}, [
      userFactory(),
      userFactory()
    ]);
    getUnverifiedUserSpy.mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy
      .mockReturnValue("ok" as any)
      .mockImplementationOnce(
        () => Promise.reject("rejected") as Promise<Response>
      )
      .mockReturnValue("ok" as any);

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfo).toHaveBeenNthCalledWith(1, {
      message: `succesfully fetched unverified 3 users`
    });
    expect(loggerInfo).toHaveBeenNthCalledWith(2, {
      message: `3 users are created over ${process.env.AUTH0_INVITATION_LIFETIME}s`
    });
    expect(deleteUserSpy).toHaveBeenCalledTimes(3);
    expect(loggerInfo).toHaveBeenNthCalledWith(3, {
      message: `successfully deleted user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}`
    });
    expect(loggerInfo).toHaveBeenNthCalledWith(4, {
      message: `successfully deleted user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}`
    });
    expect(loggerError).toHaveBeenNthCalledWith(1, {
      message: `failed to delete user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}, rejected`
    });
  });

  it("multiple unverified user with many users in db", async () => {
    const result = userSearchIncludeTotalFactory({ total: 2, length: 1 });
    getUnverifiedUserSpy
      .mockImplementationOnce(() => Promise.resolve(result))
      .mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy.mockReturnValue("ok" as any).mockReturnValue("ok" as any);

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(2);
    expect(loggerInfo).toHaveBeenNthCalledWith(1, {
      message: `succesfully fetched unverified 2 users`
    });
  });

  it("no unverified user", async () => {
    getUnverifiedUserSpy.mockImplementationOnce(() =>
      Promise.resolve([
        userFactory({
          created_at: sub(new Date(), {
            seconds: parseInt(process.env.AUTH0_INVITATION_LIFETIME!) - 10
          }).toISOString()
        })
      ])
    );

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(deleteUserSpy).toHaveBeenCalledTimes(0);
  });

  it("fails to fetch user", async () => {
    const errorMessage = "fails to fetch user";
    const errorObject = new Error(errorMessage);
    getUnverifiedUserSpy.mockImplementationOnce(() =>
      Promise.reject(errorObject)
    );

    await removeAuth0UnverifiedAccount();

    expect(loggerError).toHaveBeenCalledWith(errorObject);
  });

  it("fails to delete user", async () => {
    const errorMessage = "fails to delete user";
    const errorObject = new Error(errorMessage);
    const result = userSearchIncludeTotalFactory();
    getUnverifiedUserSpy.mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy.mockRejectedValue(errorObject);

    await removeAuth0UnverifiedAccount();

    expect(loggerInfo).toHaveBeenCalledTimes(2);
    expect(loggerInfo).toHaveBeenNthCalledWith(1, {
      message: `succesfully fetched unverified 1 users`
    });
    expect(loggerInfo).toHaveBeenNthCalledWith(2, {
      message: `1 users are created over ${process.env.AUTH0_INVITATION_LIFETIME}s`
    });
    expect(loggerError).toHaveBeenNthCalledWith(1, {
      message: `failed to delete user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}, ${errorObject}`
    });
  });
});
