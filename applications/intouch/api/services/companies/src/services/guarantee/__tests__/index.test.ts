import { CreateGuaranteeInput } from "@bmi/intouch-api-types";
import { Account } from "../../../types";
import { createGuarantee } from "..";
import { sendEmailWithTemplate } from "../../../services/mailer";

const storage = {
  uploadFileByStream: jest.fn()
};

jest.mock("../../storage-client", () => {
  return jest.fn().mockImplementation(() => storage);
});
jest.mock("../../../services/mailer", () => ({
  sendEmailWithTemplate: jest.fn()
}));
jest.mock("crypto", () => {
  return {
    randomBytes: () => "password"
  };
});

const evidenceItemInputs = [
  {
    name: "file1",
    attachment: "file1",
    attachmentUpload: {
      filename: "file1",
      mimetype: "image",
      encoding: "",
      createReadStream: () => {}
    }
  },
  {
    name: "file2",
    attachment: "file2",
    attachmentUpload: {
      filename: "file2",
      mimetype: "application/pdf",
      encoding: "",
      createReadStream: () => {}
    }
  }
];

let guaranteeInput: CreateGuaranteeInput = {
  guarantee: {
    id: 1,
    projectId: 1,
    bmiReferenceId: "",
    requestorAccountId: 1,
    guaranteeTypeId: "test_guarantee_type_id",
    evidenceItemsUsingId: {
      create: evidenceItemInputs
    }
  }
};

describe("Guarantee", () => {
  const source = {};
  const resolveInfo = {};
  const context: any = {
    pubSub: {},
    logger: jest.fn().mockReturnValue({
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn()
    }),
    pgRootPool: null,
    pgClient: {
      query: jest.fn()
    },
    user: {
      id: "1",
      company: {
        id: 1
      }
    } as Account
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should create a guarantee", async () => {
    const resolve = jest.fn();
    const args = {
      input: guaranteeInput
    };

    context.pgClient.query.mockImplementation(() => {});
    context.pgClient.query.mockImplementation(() => ({ rows: [] }));
    await createGuarantee(resolve, source, args, context, resolveInfo);

    expect(resolve).toBeCalledTimes(1);
    expect(sendEmailWithTemplate).toBeCalledTimes(1);
  });

  it("should create a guarantee with evidences", async () => {
    const resolve = jest.fn();
    const args = {
      input: {
        ...guaranteeInput,
        guarantee: {
          ...guaranteeInput.guarantee,
          evidenceItemsUsingId: {
            create: evidenceItemInputs
          }
        }
      }
    };
    context.pgClient.query.mockImplementation(() => {});
    context.pgClient.query.mockImplementation(() => ({ rows: [] }));

    await createGuarantee(resolve, source, args, context, resolveInfo);

    expect(resolve).toBeCalledTimes(1);
    expect(storage.uploadFileByStream).toHaveBeenCalledTimes(
      evidenceItemInputs.length
    );
  });
});
