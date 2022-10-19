import { CreateNoteInput } from "@bmi/intouch-api-types";
import { createNote } from "..";
import {
  sendMessageWithTemplate,
  sendMailToMarketAdmins
} from "../../../services/mailer";

jest.mock("../../../services/mailer", () => ({
  sendMessageWithTemplate: jest.fn(),
  sendMailToMarketAdmins: jest.fn()
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create note with no company admin", async () => {
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
        rows: mockAccounts
      }))
      .mockImplementationOnce(() => ({}));

    await createNote(resolve, source, args, context, resolveInfo);

    expect(resolve).toBeCalled();
    expect(sendMessageWithTemplate).not.toBeCalled();
    expect(sendMailToMarketAdmins).toHaveBeenCalledWith(
      expect.any(Object),
      "NOTE_ADDED",
      {
        project: "project_name",
        projectId: 1,
        ...authorDetails
      }
    );
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
        rows: mockAccounts
      }))
      .mockImplementationOnce(() => ({}));

    await createNote(resolve, source, args, context, resolveInfo);

    expect(resolve).toBeCalled();
    expect(sendMessageWithTemplate).toBeCalledTimes(
      mockCompanyAdminUsers.length
    );
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
    expect(sendMailToMarketAdmins).toHaveBeenCalledWith(
      expect.any(Object),
      "NOTE_ADDED",
      {
        project: "project_name",
        projectId: 1,
        ...authorDetails
      }
    );
  });

  it("should create note and send message with no author found", async () => {
    const authorDetails = {
      noteAuthor: "",
      noteSnippet: args.input.note.body
    };
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
        rows: []
      }))
      .mockImplementationOnce(() => ({}));

    await createNote(
      resolve,
      source,
      {
        input: {
          note: {
            projectId: 1,
            body: "body"
          }
        }
      },
      context,
      resolveInfo
    );

    expect(resolve).toBeCalled();
    const calledTime = mockCompanyAdminUsers.length;
    expect(sendMessageWithTemplate).toBeCalledTimes(calledTime);
    expect(sendMessageWithTemplate).toHaveBeenCalledWith(
      expect.any(Object),
      "NOTE_ADDED",
      {
        accountId: mockCompanyAdminUsers[0].id,
        email: mockCompanyAdminUsers[0].email,
        project: "project_name",
        projectId: 1,
        ...authorDetails
      }
    );
    expect(sendMessageWithTemplate).toHaveBeenCalledWith(
      expect.any(Object),
      "NOTE_ADDED",
      {
        accountId: mockCompanyAdminUsers[1].id,
        email: mockCompanyAdminUsers[1].email,
        project: "project_name",
        projectId: 1,
        ...authorDetails
      }
    );
    expect(sendMailToMarketAdmins).toHaveBeenCalledWith(
      expect.any(Object),
      "NOTE_ADDED",
      {
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
