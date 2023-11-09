import { DoceboMessageLog, MessageStatus } from "../types";

const collectionMock = jest.fn();
const docMock = jest.fn();
const getMock = jest.fn();
const setMock = jest.fn();
const dataMock = jest.fn();

jest.mock("@bmi/functions-firestore", () => ({
  getFirestore: () => ({
    collection: collectionMock.mockReturnValue({
      doc: docMock.mockReturnValue({
        set: setMock,
        get: getMock.mockReturnValue({
          data: dataMock,
          exists: true
        })
      })
    })
  })
}));

const getMessageStatus = async (collectionId: string, messageId: string) =>
  (await import("../firestore")).getMessageStatus(collectionId, messageId);

const saveById = async (
  collectionId: string,
  messageDetails: DoceboMessageLog
) => (await import("../firestore")).saveById(collectionId, messageDetails);

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

const collectionId = "fake-collection";
const messageId = "fake-message-id";

describe("getMessageStatus", () => {
  it("should return undefined if ID does not exist in Firestore", async () => {
    getMock.mockReturnValueOnce({ exists: false });
    const messageStatus = await getMessageStatus(collectionId, messageId);
    expect(messageStatus).toBeUndefined();
    expect(collectionMock).toHaveBeenCalledWith(collectionId);
    expect(docMock).toHaveBeenCalledWith(messageId);
  });

  it("should return document if ID exists in Firestore", async () => {
    const document = {
      id: messageId,
      status: MessageStatus.Succeeded
    };

    dataMock.mockReturnValue(document);
    const messageStatus = await getMessageStatus(collectionId, messageId);
    expect(messageStatus).toBe(document.status);
    expect(collectionMock).toHaveBeenCalledWith(collectionId);
    expect(docMock).toHaveBeenCalledWith(messageId);
  });
});

describe("saveById", () => {
  it("should return nothing when setting document", async () => {
    const document = { id: messageId, status: MessageStatus.Succeeded };
    await saveById(collectionId, document);

    expect(collectionMock).toHaveBeenCalledWith(collectionId);
    expect(docMock).toHaveBeenCalledWith(messageId);
    expect(setMock).toHaveBeenCalledWith(document);
  });
});
