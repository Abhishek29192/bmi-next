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

describe("Note", () => {
  const mockQuery = jest.fn();
  const context: any = {
    pubSub: {},
    logger: jest.fn().mockReturnValue({
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn()
    }),
    pgRootPool: null,
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
        projectId: 1
      }
    }
  };
  const resolveInfo = {};

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
      .mockImplementationOnce(() => ({}));

    await createNote(resolve, source, args, context, resolveInfo);

    expect(resolve).toBeCalled();
    const calledTime =
      mockCompanyAdminUsers.length + mockMarketAdminUsers.length;
    expect(sendMessageWithTemplate).toBeCalledTimes(calledTime);
  });
});
