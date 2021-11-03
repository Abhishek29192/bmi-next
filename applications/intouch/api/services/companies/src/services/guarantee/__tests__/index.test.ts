import {
  CreateGuaranteeInput,
  UpdateGuaranteeInput
} from "@bmi/intouch-api-types";
import { createGuarantee, updateGuarantee } from "..";
import { sendMessageWithTemplate } from "../../../services/mailer";

const storage = {
  uploadFileByStream: jest.fn()
};

const randomPassword = "randomPassword";

jest.mock("../../storage-client", () => {
  return jest.fn().mockImplementation(() => storage);
});
jest.mock("../../../services/mailer", () => ({
  sendMessageWithTemplate: jest.fn()
}));
jest.mock("crypto", () => {
  return {
    randomBytes: () => randomPassword
  };
});

jest.mock("../validate", () => ({
  solutionGuaranteeSubmitValidate: jest
    .fn()
    .mockImplementation(() => ({ isValid: true }))
}));

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
    guaranteeReferenceCode: "PITCHED_PRODUCT",
    evidenceItemsUsingId: {
      create: evidenceItemInputs
    }
  }
};

let guaranteeUpdateInput: UpdateGuaranteeInput = {
  id: 1,
  guaranteeEventType: "SUBMIT_SOLUTION",
  patch: {
    id: 1,
    projectId: 1,
    guaranteeReferenceCode: "PITCHED_SOLUTION"
  }
};

describe("Guarantee", () => {
  const source = {};
  const resolveInfo = {};
  const userCanMock = jest.fn();
  const mockUser = {
    id: 3,
    company: {
      id: 1
    },
    can: userCanMock
  };
  const mockQuery = jest.fn();
  const mockClientGateway = jest.fn();

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
    user: mockUser,
    clientGateway: mockClientGateway
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a guarantee", async () => {
      const resolve = jest.fn();
      const args = {
        input: guaranteeInput
      };

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [{ maximum_validity_years: 1 }]
        }))
        .mockImplementationOnce(() => ({
          rows: [{ name: "project" }]
        }))
        .mockImplementationOnce(() => ({
          rows: []
        }));

      mockClientGateway.mockImplementationOnce(() => ({
        data: {
          tierBenefitCollection: {
            items: [
              {
                guaranteeValidityOffsetYears: 0
              }
            ]
          }
        }
      }));

      await createGuarantee(resolve, source, args, context, resolveInfo);

      expect(resolve).toBeCalledTimes(1);
      expect(sendMessageWithTemplate).toBeCalledTimes(1);
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
          rows: [{ maximum_validity_years: 1 }]
        }))
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
  });

  describe("update", () => {
    const resolve = jest.fn();
    const mockGuarante = {
      id: 1,
      status: "",
      systemBmiRef: ""
    };
    const guaranteMockImplementation = () => ({
      rows: [mockGuarante]
    });
    mockQuery
      .mockImplementation(() => {})
      .mockImplementation(guaranteMockImplementation);

    const args = {
      input: {
        ...guaranteeUpdateInput,
        patch: {
          ...guaranteeUpdateInput.patch
        }
      }
    };
    it("shouldn't be able to update guarantee when user unauthorised", async () => {
      context.user.can = () => false;

      await expect(
        updateGuarantee(resolve, source, args, context, resolveInfo)
      ).rejects.toThrow("unauthorized");
    });
    it("should be able to submit new guarantee", async () => {
      context.user.can = () => true;
      mockGuarante.status = "NEW";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.requestorAccountId).toEqual(mockUser.id);
      expect(patch.bmiReferenceId).toEqual(randomPassword);
      expect(patch.status).toEqual("SUBMITTED");

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to submit rejected guarantee", async () => {
      context.user.can = () => true;
      const args = {
        input: { ...guaranteeUpdateInput }
      };
      mockGuarante.status = "REJECTED";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.requestorAccountId).toEqual(mockUser.id);
      expect(patch.status).toEqual("SUBMITTED");
      expect(patch.productBmiRef).toBeUndefined();

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to assing guarantee", async () => {
      context.user.can = () => true;
      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "ASSIGN_SOLUTION"
        }
      };
      mockGuarante.status = "SUBMITTED";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.reviewerAccountId).toEqual(mockUser.id);
      expect(patch.status).toEqual("REVIEW");

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to re-assing guarantee", async () => {
      context.user.can = () => true;
      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "REASSIGN_SOLUTION"
        }
      };
      mockGuarante.status = "REVIEW";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.reviewerAccountId).toEqual(mockUser.id);
      expect(patch.status).toEqual("REVIEW");

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to un-assing guarantee", async () => {
      context.user.can = () => true;
      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "UNASSIGN_SOLUTION"
        }
      };
      mockGuarante.status = "REVIEW";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.reviewerAccountId).toBeNull();
      expect(patch.status).toEqual("SUBMITTED");

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to approve guarantee", async () => {
      context.user.can = () => true;
      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "APPROVE_SOLUTION"
        }
      };
      mockGuarante.status = "REVIEW";

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(guaranteMockImplementation)
        .mockImplementationOnce(() => ({
          rows: [{ maximum_validity_years: 1 }]
        }));

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.status).toEqual("APPROVED");

      expect(resolve).toBeCalledTimes(1);
    });
    it("should be able to reject guarantee", async () => {
      context.user.can = () => true;
      const args: { input: UpdateGuaranteeInput } = {
        input: {
          ...guaranteeUpdateInput,
          guaranteeEventType: "REJECT_SOLUTION"
        }
      };
      mockGuarante.status = "REVIEW";

      await updateGuarantee(resolve, source, args, context, resolveInfo);

      const { patch } = args.input;
      expect(patch.reviewerAccountId).toBeNull();
      expect(patch.status).toEqual("REJECTED");

      expect(resolve).toBeCalledTimes(1);
    });
  });
});
