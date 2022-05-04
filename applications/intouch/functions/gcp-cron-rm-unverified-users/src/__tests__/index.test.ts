import { sub } from "date-fns";
import {
  userFactory,
  userSearchIncludeTotalFactory
} from "../lib/utils/tests/user";
import { removeAuth0UnverifiedAccount } from "..";
import Auth0Client from "../Auth0Client";

process.env.AUTH0_INVITATION_LIFETIME = "432000";

const getUnverifiedUserSpy = jest.spyOn(
  Auth0Client.prototype,
  "getUnverifiedUser"
);
const deleteUserSpy = jest.spyOn(Auth0Client.prototype, "deleteUser");
const consoleLogSpy = jest.fn();
global.console = {
  ...console,
  log: (...params) => consoleLogSpy(...params)
};

describe("removeAuth0UnverifiedAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("normal case", async () => {
    const result = userSearchIncludeTotalFactory();
    getUnverifiedUserSpy.mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy.mockImplementationOnce(() => Promise.resolve(null));

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      `succesfully fetched uninvited 1 users`
    );
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      2,
      `successfully deleted user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}`
    );
  });

  it("filter user smaller than auth0_invitation_lifetime env", async () => {
    const result = userSearchIncludeTotalFactory({}, [
      userFactory({
        created_at: sub(new Date(), {
          seconds: parseInt(process.env.AUTH0_INVITATION_LIFETIME) - 10
        }).toISOString()
      })
    ]);
    getUnverifiedUserSpy.mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy.mockImplementationOnce(() => Promise.resolve(null));

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      `succesfully fetched uninvited 2 users`
    );
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      2,
      `successfully deleted user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}`
    );
    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
  });

  it("multiple unverified user", async () => {
    const result = userSearchIncludeTotalFactory({}, [
      userFactory(),
      userFactory()
    ]);
    getUnverifiedUserSpy.mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy
      .mockImplementationOnce(() => Promise.resolve(null))
      .mockImplementationOnce(() => Promise.reject({ message: "rejected" }))
      .mockImplementationOnce(() => Promise.resolve(null));

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      `succesfully fetched uninvited 3 users`
    );
    expect(deleteUserSpy).toHaveBeenCalledTimes(3);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      2,
      `successfully deleted user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}`
    );
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      3,
      `successfully deleted user with email ${result.users[0].email} auth0 Id: ${result.users[0].user_id}`
    );
  });

  it("multiple unverified user with many users in db", async () => {
    const result = userSearchIncludeTotalFactory({ total: 2, length: 1 });
    getUnverifiedUserSpy
      .mockImplementationOnce(() => Promise.resolve(result))
      .mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy
      .mockImplementationOnce(() => Promise.resolve(null))
      .mockImplementationOnce(() => Promise.resolve(null));

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(2);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      `succesfully fetched uninvited 2 users`
    );
  });

  it("no unverified user", async () => {
    getUnverifiedUserSpy.mockImplementationOnce(() =>
      Promise.resolve([
        userFactory({
          created_at: sub(new Date(), {
            seconds: parseInt(process.env.AUTH0_INVITATION_LIFETIME) - 10
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

    expect(consoleLogSpy).toHaveBeenCalledWith(errorObject);
  });

  it("fails to delete user", async () => {
    const errorMessage = "fails to delete user";
    const errorObject = new Error(errorMessage);
    const result = userSearchIncludeTotalFactory();
    getUnverifiedUserSpy.mockImplementationOnce(() => Promise.resolve(result));
    deleteUserSpy.mockImplementationOnce(() => Promise.reject(errorObject));

    await removeAuth0UnverifiedAccount();

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(
      1,
      `succesfully fetched uninvited 1 users`
    );
  });
});
