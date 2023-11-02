import { BuildLog } from "@bmi/firestore-types";
import { getBuildStartedEventId, setDocumentInFirestore } from "../db";
import { BuildStatusType } from "../types";

const setDocumentMock = jest.fn();
const getDocumentsMock = jest.fn();
const getDocumentMock = jest.fn().mockReturnValue({ set: setDocumentMock });
const whereMock = jest.fn();

jest.mock("@bmi/functions-firestore", () => ({
  getFirestore: () => ({
    collection: () => ({
      where: whereMock.mockReturnValue({ get: getDocumentsMock })
    }),
    doc: (...args: unknown[]) => getDocumentMock(...args)
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("getBuildStartedEventId", () => {
  it("returns undefined if getDocumentsMock returns an empty array", async () => {
    getDocumentsMock.mockReturnValue({ empty: true, docs: [] });
    const result = await getBuildStartedEventId("fake-collection", false);
    expect(whereMock).toHaveBeenCalledWith(
      "eventType",
      "==",
      BuildStatusType.BUILD_STARTED
    );
    expect(result).toBeUndefined();
  });

  it("returns build id if getDocumentsMock returns an array of documents", async () => {
    getDocumentsMock.mockReturnValue({
      empty: false,
      docs: [
        {
          id: "fake-id"
        }
      ]
    });
    const result = await getBuildStartedEventId("fake-collection", false);
    expect(whereMock).toHaveBeenCalledWith(
      "eventType",
      "==",
      BuildStatusType.BUILD_STARTED
    );
    expect(result).toBe("fake-id");
  });

  it("calls 'where' function correctly if isPreviewEvent === true ", async () => {
    const isPreviewEvent = true;
    getDocumentsMock.mockReturnValue({
      empty: true,
      docs: []
    });
    await getBuildStartedEventId("fake-collection", isPreviewEvent);
    expect(whereMock).toHaveBeenCalledWith(
      "eventType",
      "==",
      BuildStatusType.PREVIEW_BUILD_STARTED
    );
  });

  it("returns undefined if an error occurs", async () => {
    getDocumentsMock.mockRejectedValue(new Error());
    const res = await getBuildStartedEventId("fake-collection", false);
    expect(res).toBeUndefined();
  });
});

describe("setDocumentInFirestore", () => {
  it("writes a document to Firestore", async () => {
    const document: BuildLog = {
      timestamp: 1665360000000,
      eventType: BuildStatusType.BUILD_SUCCEEDED,
      body: "Succeeded",
      buildId: "build-id"
    };

    await setDocumentInFirestore(document.timestamp.toString(), document);
    expect(getDocumentMock).toHaveBeenCalledWith(document.timestamp.toString());
    expect(setDocumentMock).toHaveBeenCalledWith(document);
  });
});
