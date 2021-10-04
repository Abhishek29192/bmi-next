import { DeleteEvidenceItemInput } from "@bmi/intouch-api-types";
import { deleteEvidenceItem } from "..";

const storage = {
  uploadFileByStream: jest.fn(),
  deleteFile: jest.fn()
};

describe("evidenceItem", () => {
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
  const args: {
    input: DeleteEvidenceItemInput;
  } = {
    input: {
      id: 1
    }
  };
  const resolveInfo = {};

  it("shouldn't be able to delete evidence when user unauthorised", async () => {
    context.user.can = () => false;

    await expect(
      deleteEvidenceItem(resolve, source, args, context, resolveInfo)
    ).rejects.toThrow("unauthorized");
  });

  it("should not be able to delete evidence when evidence category is PROOF_OF_PURCHASE", async () => {
    context.user.can = () => true;

    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: [
          {
            id: 1,
            evidenceCategoryType: "PROOF_OF_PURCHASE",
            attachment: "",
            guaranteeId: 1,
            guaranteeStatus: "APPROVED"
          }
        ]
      }));

    await expect(
      deleteEvidenceItem(resolve, source, args, context, resolveInfo)
    ).rejects.toThrow("You can not delete Proof of purchase evidences");
  });

  it("should not be able to delete evidence when evidence guarantee status is APPROVED", async () => {
    context.user.can = () => true;

    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: [
          {
            id: 1,
            evidenceCategoryType: "CUSTOM",
            attachment: "",
            guaranteeId: 1,
            guaranteeStatus: "APPROVED"
          }
        ]
      }));

    await expect(
      deleteEvidenceItem(resolve, source, args, context, resolveInfo)
    ).rejects.toThrow(
      "You can't delete the evidence item which the guarantee status is in the REVIEW or APPROVED"
    );
  });

  it("should able to delete evidence ", async () => {
    context.user.can = () => true;

    mockQuery
      .mockImplementationOnce(() => {})
      .mockImplementationOnce(() => ({
        rows: [
          {
            id: 1,
            evidenceCategoryType: "CUSTOM",
            attachment: "",
            guaranteeId: 1,
            guaranteeStatus: "REJECTED"
          }
        ]
      }));

    await deleteEvidenceItem(resolve, source, args, context, resolveInfo);
    expect(resolve).toBeCalledTimes(1);
    expect(storage.deleteFile).toHaveBeenCalledTimes(1);
  });
});
