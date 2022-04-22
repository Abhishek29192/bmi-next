import { sub } from "date-fns";
import { userFactory } from "../lib/utils/tests/user";
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
    getUnverifiedUserSpy.mockImplementationOnce(() =>
      Promise.resolve([userFactory()])
    );
    deleteUserSpy.mockImplementationOnce(() => Promise.resolve(null));

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
  });

  it("filter user smaller than auth0_invitation_lifetime env", async () => {
    getUnverifiedUserSpy.mockImplementationOnce(() =>
      Promise.resolve([
        userFactory({
          created_at: sub(new Date(), {
            seconds: parseInt(process.env.AUTH0_INVITATION_LIFETIME) - 10
          }).toISOString()
        }),
        userFactory()
      ])
    );
    deleteUserSpy.mockImplementationOnce(() => Promise.resolve(null));

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(deleteUserSpy).toHaveBeenCalledTimes(1);
  });

  it("multiple unverified user", async () => {
    getUnverifiedUserSpy.mockImplementationOnce(() =>
      Promise.resolve([userFactory(), userFactory()])
    );
    deleteUserSpy
      .mockImplementationOnce(() => Promise.resolve(null))
      .mockImplementationOnce(() => Promise.resolve(null));

    await removeAuth0UnverifiedAccount();

    expect(getUnverifiedUserSpy).toHaveBeenCalledTimes(1);
    expect(deleteUserSpy).toHaveBeenCalledTimes(2);
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
    getUnverifiedUserSpy.mockImplementationOnce(() =>
      Promise.resolve([userFactory()])
    );
    deleteUserSpy.mockImplementationOnce(() => Promise.reject(errorObject));

    await removeAuth0UnverifiedAccount();

    expect(consoleLogSpy).toHaveBeenCalledWith([errorObject]);
  });
});
