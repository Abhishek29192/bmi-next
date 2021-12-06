import {
  CreateCompanyDocumentsInput,
  DeleteCompanyDocumentInput
} from "@bmi/intouch-api-types";
import { createCompanyDocuments, deleteCompanyDocument } from "..";

const storage = {
  uploadFileByStream: jest.fn(),
  deleteFile: jest.fn()
};

describe("Company Documents", () => {
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
      can: jest.fn()
    },
    storageClient: storage
  };
  const resolve = jest.fn();
  const source = {};
  const resolveInfo = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("add document", () => {
    const args: {
      input: CreateCompanyDocumentsInput;
    } = {
      input: {
        documents: [
          {
            companyId: 1,
            document: "mock-file.pdf",
            attachmentUpload: new File([], "mock-file.pdf")
          }
        ]
      }
    };
    it("shouldn't be able to add document when user unauthorised", async () => {
      context.user.can = () => false;

      await expect(
        createCompanyDocuments(resolve, source, args, context, resolveInfo)
      ).rejects.toThrow("unauthorized");
    });

    it("should able to add document ", async () => {
      context.user.can = () => true;

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [
            {
              id: 1,
              document: ""
            }
          ]
        }));

      await createCompanyDocuments(resolve, source, args, context, resolveInfo);
      expect(resolve).toBeCalledTimes(1);
      expect(storage.uploadFileByStream).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete document", () => {
    const args: {
      input: DeleteCompanyDocumentInput;
    } = {
      input: {
        id: 1
      }
    };
    it("shouldn't be able to delete document when user unauthorised", async () => {
      context.user.can = () => false;

      await expect(
        deleteCompanyDocument(resolve, source, args, context, resolveInfo)
      ).rejects.toThrow("unauthorized");
    });

    it("should able to delete document ", async () => {
      context.user.can = () => true;

      mockQuery
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => ({
          rows: [
            {
              id: 1,
              document: ""
            }
          ]
        }));

      await deleteCompanyDocument(resolve, source, args, context, resolveInfo);
      expect(resolve).toBeCalledTimes(1);
      expect(storage.deleteFile).toHaveBeenCalledTimes(1);
    });
  });
});
