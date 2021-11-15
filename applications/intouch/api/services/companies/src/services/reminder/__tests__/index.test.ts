import { FindIncompleteCompanyProfile } from "@bmi/intouch-api-types";
import { sendMessageWithTemplate } from "../../mailer";
import { sendReminderToIncompleteCompanyProfile } from "..";

jest.mock("../../mailer", () => ({
  sendMessageWithTemplate: jest.fn()
}));

describe("send reminder", () => {
  const mockQuery = jest.fn();
  const context: any = {
    pubSub: {},
    logger: jest.fn().mockReturnValue({
      info: jest.fn(),
      log: jest.fn(),
      error: jest.fn()
    }),
    pgRootPool: null,
    pgClient: {
      query: mockQuery
    },
    user: {
      id: 3,
      can: jest.fn()
    }
  };
  const resolve = jest.fn();
  const resolveInfo = {};

  const incompleteAccounts: FindIncompleteCompanyProfile[] = [
    {
      id: 1,
      firstName: "firstName",
      lastName: "lastName",
      email: "email"
    }
  ];
  it("should not send a reminder when an incomplete company profile does not exist", async () => {
    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: []
      }));

    await sendReminderToIncompleteCompanyProfile(
      resolve,
      null,
      context,
      resolveInfo
    );
    expect(sendMessageWithTemplate).not.toBeCalled();
  });
  it("should send a reminder when an incomplete company profile exists", async () => {
    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: incompleteAccounts
      }));

    await sendReminderToIncompleteCompanyProfile(
      resolve,
      null,
      context,
      resolveInfo
    );
    expect(sendMessageWithTemplate).toBeCalledTimes(incompleteAccounts.length);
  });
});
