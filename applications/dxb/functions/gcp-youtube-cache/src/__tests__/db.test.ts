import { createYoutubeDetails, YoutubeDetails } from "@bmi/firestore-types";
import createYoutubeVideoListResponse from "./YoutubeVideoListResponseHelper";

const mockGetFirestore = jest.fn();
const collection = jest.fn();
const doc = jest.fn();
const get = jest.fn();
const set = jest.fn();
jest.mock("@bmi/functions-firestore", () => ({
  getFirestore: () => mockGetFirestore()
}));

const youtube = jest.fn();
const list = jest.fn();
jest.mock("googleapis/build/src/apis/youtube", () => ({ youtube }));

const getById = async (youtubeId: string) =>
  (await import("../db")).getById(youtubeId);

const getYoutubeDetails = async (youtubeId: string) =>
  (await import("../db")).getYoutubeDetails(youtubeId);

const saveById = async (youtubeId: string, youtubeDetails: YoutubeDetails) =>
  (await import("../db")).saveById(youtubeId, youtubeDetails);

const youtubeId = "youtube-id";

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  doc.mockReturnValue({
    get,
    set
  });
  collection.mockReturnValue({ doc });
  youtube.mockReturnValue({
    videos: { list }
  });
});

describe("getById", () => {
  it("should throw error when getting firestore client throws error", async () => {
    mockGetFirestore.mockImplementationOnce(() => {
      throw new Error("Expected error");
    });

    try {
      await getById(youtubeId);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(mockGetFirestore).toHaveBeenCalled();
    expect(collection).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(get).not.toHaveBeenCalled();
  });

  it("should throw error when getting document throws error", async () => {
    mockGetFirestore.mockReturnValueOnce({
      collection: (collectionName: string) => collection(collectionName)
    });
    get.mockRejectedValue(Error("Expected error"));

    try {
      await getById(youtubeId);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(mockGetFirestore).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(get).toHaveBeenCalled();
  });

  it("should return undefined if ID does not exist in Firestore", async () => {
    mockGetFirestore.mockReturnValueOnce({
      collection: (collectionName: string) => collection(collectionName)
    });
    get.mockResolvedValue({ exists: false });

    const youtubeDetails = await getById(youtubeId);

    expect(youtubeDetails).toBeUndefined();
    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(mockGetFirestore).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(get).toHaveBeenCalled();
  });

  it("should return document if ID exists in Firestore", async () => {
    const expectedYoutubeDetails = createYoutubeVideoListResponse();
    mockGetFirestore.mockReturnValueOnce({
      collection: (collectionName: string) => collection(collectionName)
    });
    get.mockResolvedValue({ exists: true, data: () => expectedYoutubeDetails });

    const actualYoutubeDetails = await getById(youtubeId);

    expect(actualYoutubeDetails).toStrictEqual(expectedYoutubeDetails);
    expect(mockGetFirestore).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(get).toHaveBeenCalled();
  });
});

describe("getYoutubeDetails", () => {
  it("should throw error when list Youtube videos throws error", async () => {
    const youtubeApiKey = "youtube-api-key";
    list.mockRejectedValue(Error("Expected error"));

    try {
      await getYoutubeDetails(youtubeId);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(youtube).toHaveBeenCalledWith({
      version: "v3",
      auth: youtubeApiKey
    });
    expect(list).toHaveBeenCalledWith({
      part: ["snippet", "player", "status"],
      fields:
        "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
      id: [youtubeId],
      maxHeight: 9999
    });
  });

  it("should return undefined when items from list Youtube videos response is undefined", async () => {
    const youtubeApiKey = "youtube-api-key";
    list.mockResolvedValue({
      data: {}
    });

    const actualYoutubeDetails = await getYoutubeDetails(youtubeId);

    expect(actualYoutubeDetails).toBeUndefined();
    expect(youtube).toHaveBeenCalledWith({
      version: "v3",
      auth: youtubeApiKey
    });
    expect(list).toHaveBeenCalledWith({
      part: ["snippet", "player", "status"],
      fields:
        "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
      id: [youtubeId],
      maxHeight: 9999
    });
  });

  it("should return undefined if items from list Youtube videos response is empty", async () => {
    const youtubeApiKey = "youtube-api-key";
    list.mockResolvedValue({
      data: {
        items: []
      }
    });

    const actualYoutubeDetails = await getYoutubeDetails(youtubeId);

    expect(actualYoutubeDetails).toBeUndefined();
    expect(youtube).toHaveBeenCalledWith({
      version: "v3",
      auth: youtubeApiKey
    });
    expect(list).toHaveBeenCalledWith({
      part: ["snippet", "player", "status"],
      fields:
        "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
      id: [youtubeId],
      maxHeight: 9999
    });
  });

  it("should return undefined if item embedHeight from list Youtube videos response is undefined", async () => {
    const youtubeApiKey = "youtube-api-key";
    list.mockResolvedValue({
      data: {
        items: [{ player: { embedHeight: undefined, embedWidth: 16 } }]
      }
    });

    const actualYoutubeDetails = await getYoutubeDetails(youtubeId);

    expect(actualYoutubeDetails).toBeUndefined();
    expect(youtube).toHaveBeenCalledWith({
      version: "v3",
      auth: youtubeApiKey
    });
    expect(list).toHaveBeenCalledWith({
      part: ["snippet", "player", "status"],
      fields:
        "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
      id: [youtubeId],
      maxHeight: 9999
    });
  });

  it("should return undefined if item embedWidth from list Youtube videos response is undefined", async () => {
    const youtubeApiKey = "youtube-api-key";
    list.mockResolvedValue({
      data: {
        items: [{ player: { embedHeight: 9, embedWidth: undefined } }]
      }
    });

    const actualYoutubeDetails = await getYoutubeDetails(youtubeId);

    expect(actualYoutubeDetails).toBeUndefined();
    expect(youtube).toHaveBeenCalledWith({
      version: "v3",
      auth: youtubeApiKey
    });
    expect(list).toHaveBeenCalledWith({
      part: ["snippet", "player", "status"],
      fields:
        "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
      id: [youtubeId],
      maxHeight: 9999
    });
  });

  it("should return data from list Youtube videos response", async () => {
    const youtubeApiKey = "youtube-api-key";
    list.mockResolvedValue({ data: createYoutubeVideoListResponse() });

    const actualYoutubeDetails = await getYoutubeDetails(youtubeId);

    expect(actualYoutubeDetails).toStrictEqual(createYoutubeDetails());
    expect(youtube).toHaveBeenCalledWith({
      version: "v3",
      auth: youtubeApiKey
    });
    expect(list).toHaveBeenCalledWith({
      part: ["snippet", "player", "status"],
      fields:
        "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
      id: [youtubeId],
      maxHeight: 9999
    });
  });
});

describe("saveById", () => {
  it("should throw error when getting Firestore docuument Id throws an error", async () => {
    const youtubeDetails = createYoutubeDetails();
    mockGetFirestore.mockImplementationOnce(() => {
      throw new Error("Expected error");
    });

    try {
      await saveById(youtubeId, youtubeDetails);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(mockGetFirestore).toHaveBeenCalled();
    expect(collection).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalledWith(youtubeId);
    expect(set).not.toHaveBeenCalled();
  });

  it("should throw error when setting document throws error", async () => {
    const youtubeDetails = createYoutubeDetails();
    mockGetFirestore.mockReturnValueOnce({
      collection: (collectionName: string) => collection(collectionName)
    });
    set.mockRejectedValue(Error("Expected error"));

    try {
      await saveById(youtubeId, youtubeDetails);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(mockGetFirestore).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(set).toHaveBeenCalledWith(youtubeDetails);
  });

  it("should return nothing when setting document", async () => {
    const youtubeDetails = createYoutubeDetails();
    mockGetFirestore.mockReturnValueOnce({
      collection: (collectionName: string) => collection(collectionName)
    });

    await saveById(youtubeId, youtubeDetails);

    expect(mockGetFirestore).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(set).toHaveBeenCalledWith(youtubeDetails);
  });
});
