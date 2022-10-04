import { CreateNoteInput } from "@bmi/intouch-api-types";
import { createNote } from "..";
import { sendMessageWithTemplate } from "../../../services/mailer";

jest.mock("../../../services/mailer", () => ({
  sendMessageWithTemplate: jest.fn()
}));

const mockCompanyAdminUsers = [
  {
    id: 1,
    email: "email1"
  },
  {
    id: 2,
    email: "email2"
  }
];
const mockMarketAdminUsers = [
  {
    id: 11,
    email: "email11"
  }
];
const mockAccounts = [
  {
    email: "authorEmail",
    first_name: "Author first name",
    last_name: "Author last name"
  }
];

describe("Note", () => {
  const mockQuery = jest.fn();
  const loggerError = jest.fn();
  const context: any = {
    pubSub: {},
    logger: jest.fn().mockReturnValue({
      debug: jest.fn(),
      log: jest.fn(),
      error: loggerError
    }),
    pgRootPool: {
      query: mockQuery
    },
    pgClient: {
      query: mockQuery
    },
    user: {
      id: 3,
      company: {
        id: 1
      },
      can: jest.fn()
    }
  };
  const resolve = jest.fn();
  const source = {};
  const args: {
    input: CreateNoteInput;
  } = {
    input: {
      note: {
        authorId: 1,
        projectId: 1,
        body: "body"
      }
    }
  };
  const resolveInfo = {};
  const authorDetails = {
    noteAuthor: `${mockAccounts[0].first_name} ${mockAccounts[0].last_name} (${mockAccounts[0].email})`,
    noteSnippet: args.input.note.body
  };

  it("should create note", async () => {
    context.user.can = () => true;

    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: [
          {
            name: "project_name",
            companyId: 1,
            marketId: 1
          }
        ]
      }))
      .mockImplementationOnce(() => ({
        rows: []
      }))
      .mockImplementationOnce(() => ({
        rows: []
      }))
      .mockImplementationOnce(() => ({
        rows: mockAccounts
      }))
      .mockImplementationOnce(() => ({}));

    await createNote(resolve, source, args, context, resolveInfo);

    expect(resolve).toBeCalled();
    expect(sendMessageWithTemplate).not.toBeCalled();
  });

  it("should create note and send message to company&&market admin", async () => {
    context.user.can = () => true;

    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: [
          {
            name: "project_name",
            companyId: 1,
            marketId: 1
          }
        ]
      }))
      .mockImplementationOnce(() => ({
        rows: mockCompanyAdminUsers
      }))
      .mockImplementationOnce(() => ({
        rows: mockMarketAdminUsers
      }))
      .mockImplementationOnce(() => ({
        rows: mockAccounts
      }))
      .mockImplementationOnce(() => ({}));

    await createNote(resolve, source, args, context, resolveInfo);

    expect(resolve).toBeCalled();
    const calledTime =
      mockCompanyAdminUsers.length + mockMarketAdminUsers.length;
    expect(sendMessageWithTemplate).toBeCalledTimes(calledTime);
    expect(sendMessageWithTemplate).toHaveBeenCalledWith(
      expect.any(Object),
      "NOTE_ADDED",
      {
        accountId: 1,
        email: "email1",
        project: "project_name",
        projectId: 1,
        ...authorDetails
      }
    );
    expect(sendMessageWithTemplate).toHaveBeenCalledWith(
      expect.any(Object),
      "NOTE_ADDED",
      {
        accountId: 2,
        email: "email2",
        project: "project_name",
        projectId: 1,
        ...authorDetails
      }
    );
    expect(sendMessageWithTemplate).toHaveBeenCalledWith(
      expect.any(Object),
      "NOTE_ADDED",
      {
        accountId: 11,
        email: "email11",
        project: "project_name",
        projectId: 1,
        ...authorDetails
      }
    );
  });

  it("call logger when createNote throw error", async () => {
    context.user.can = () => true;
    resolve.mockRejectedValueOnce("I am error");
    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: [
          {
            name: "project_name",
            companyId: 1,
            marketId: 1
          }
        ]
      }))
      .mockImplementationOnce(() => ({
        rows: []
      }))
      .mockImplementationOnce(() => ({
        rows: []
      }))
      .mockImplementationOnce(() => ({}));

    await expect(
      createNote(resolve, source, args, context, resolveInfo)
    ).rejects.toEqual("I am error");

    expect(loggerError).toHaveBeenCalledWith(
      "Error insert note:",
      "I am error"
    );
  });
});
