import {
  CreateGuaranteeInput,
  UpdateGuaranteeInput
} from "@bmi/intouch-api-types";
import { Account } from "../../../types";
import { createGuarantee, updateGuarantee } from "..";
import { sendEmailWithTemplate } from "../../../services/mailer";

const storage = {
  uploadFileByStream: jest.fn()
};

const randomPassword = "randomPassword";

jest.mock("../../storage-client", () => {
  return jest.fn().mockImplementation(() => storage);
});
jest.mock("../../../services/mailer", () => ({
  sendEmailWithTemplate: jest.fn()
}));
jest.mock("crypto", () => {
  return {
    randomBytes: () => randomPassword
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

let guaranteeUpdateInput: UpdateGuaranteeInput = {
  id: 1,
  patch: {
    id: 1,
    projectId: 1,
    guaranteeTypeId: "test_guarantee_type_id"
  }
};

describe("Guarantee", () => {
  const source = {};
  const resolveInfo = {};
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

    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: [{ name: "project" }]
      }))
      .mockImplementationOnce(() => ({
        rows: []
      }));

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

    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: [{ name: "project" }]
      }))
      .mockImplementationOnce(() => ({
        rows: []
      }));

    await createGuarantee(resolve, source, args, context, resolveInfo);

    expect(resolve).toBeCalledTimes(1);
    expect(storage.uploadFileByStream).toHaveBeenCalledTimes(
      evidenceItemInputs.length
    );
  });

  it("should update guarantee with bmiReferenceId", async () => {
    const resolve = jest.fn();
    const args = {
      input: guaranteeUpdateInput
    };

    mockQuery.mockImplementation(() => {});

    await updateGuarantee(resolve, source, args, context, resolveInfo);

    const { patch } = args.input;
    expect(patch.bmiReferenceId).toEqual(randomPassword);

    expect(resolve).toBeCalledTimes(1);
  });
});
