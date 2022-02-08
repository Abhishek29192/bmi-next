import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";

const collection = jest.fn();
const doc = jest.fn();
const get = jest.fn();
const set = jest.fn();
jest.mock("@bmi/functions-firestore", () => ({
  getFirestore: () => ({
    collection: (...args: any) => collection(...args)
  })
}));

const getSecret = jest.fn();
jest.mock("@bmi/functions-secret-client", () => ({
  getSecret
}));

const youtube = jest.fn();
const list = jest.fn();
jest.mock("googleapis/build/src/apis/youtube", () => ({ youtube }));

const createYoutubeDetails = (): youtube_v3.Schema$VideoListResponse => ({
  etag: "list-response-etag",
  items: [
    {
      etag: "item-etag",
      id: "item-id",
      kind: "youtube#video",
      player: {
        embedHeight: "9999",
        embedHtml:
          '<iframe width="17776" height="9999" src="https://www.youtube.com/embed/item-id" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        embedWidth: "17776"
      }
    }
  ],
  kind: "youtube#videoListResponse",
  pageInfo: {
    resultsPerPage: 1,
    totalResults: 1
  }
});

const getById = async (youtubeId: string) =>
  (await import("../db")).getById(youtubeId);

const getYoutubeDetails = async (youtubeId: string) =>
  (await import("../db")).getYoutubeDetails(youtubeId);

const saveById = async (
  youtubeId: string,
  youtubeDetails: youtube_v3.Schema$VideoListResponse
) => (await import("../db")).saveById(youtubeId, youtubeDetails);

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
  it("should throw error when getting document throws error", async () => {
    get.mockRejectedValue(Error("Expected error"));

    try {
      await getById(youtubeId);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(get).toHaveBeenCalled();
  });

  it("should return undefined if ID does not exist in Firestore", async () => {
    get.mockResolvedValue({ exists: false });

    await getById(youtubeId);

    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(get).toHaveBeenCalled();
  });

  it("should return document if ID exists in Firestore", async () => {
    const expectedYoutubeDetails = createYoutubeDetails();
    get.mockResolvedValue({ exists: true, data: () => expectedYoutubeDetails });

    const actualYoutubeDetails = await getById(youtubeId);

    expect(actualYoutubeDetails).toStrictEqual(expectedYoutubeDetails);
    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(get).toHaveBeenCalled();
  });
});

describe("getYoutubeDetails", () => {
  it("should throw error when get Youtube API secret throws error", async () => {
    getSecret.mockRejectedValue(Error("Expected error"));

    try {
      await getYoutubeDetails(youtubeId);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(getSecret).toHaveBeenCalledWith(
      process.env.GOOGLE_YOUTUBE_API_KEY_SECRET
    );
    expect(youtube).not.toHaveBeenCalled();
  });

  it("should throw error when list Youtube videos throws error", async () => {
    const youtubeApiKey = "youtube-api-key";
    getSecret.mockResolvedValue(youtubeApiKey);
    list.mockRejectedValue(Error("Expected error"));

    try {
      await getYoutubeDetails(youtubeId);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(getSecret).toHaveBeenCalledWith(
      process.env.GOOGLE_YOUTUBE_API_KEY_SECRET
    );
    expect(youtube).toHaveBeenCalledWith({
      version: "v3",
      auth: youtubeApiKey
    });
    expect(list).toHaveBeenCalledWith({
      part: ["player"],
      id: [youtubeId],
      maxHeight: 9999
    });
  });

  it("should return data from list Youtube videos response", async () => {
    const youtubeApiKey = "youtube-api-key";
    getSecret.mockResolvedValue(youtubeApiKey);
    const expectedYoutubeDetails = createYoutubeDetails();
    list.mockResolvedValue({ data: expectedYoutubeDetails });

    const actualYoutubeDetails = await getYoutubeDetails(youtubeId);

    expect(actualYoutubeDetails).toStrictEqual(expectedYoutubeDetails);
    expect(getSecret).toHaveBeenCalledWith(
      process.env.GOOGLE_YOUTUBE_API_KEY_SECRET
    );
    expect(youtube).toHaveBeenCalledWith({
      version: "v3",
      auth: youtubeApiKey
    });
    expect(list).toHaveBeenCalledWith({
      part: ["player"],
      id: [youtubeId],
      maxHeight: 9999
    });
  });
});

describe("saveById", () => {
  it("should throw error when setting document throws error", async () => {
    const youtubeDetails = createYoutubeDetails();

    set.mockRejectedValue(Error("Expected error"));

    try {
      await saveById(youtubeId, youtubeDetails);
      expect(false).toEqual("An error should have been thrown");
    } catch (error) {
      expect((error as Error).message).toStrictEqual("Expected error");
    }

    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(set).toHaveBeenCalledWith(youtubeDetails);
  });

  it("should return nothing when setting document", async () => {
    const youtubeDetails = createYoutubeDetails();

    await saveById(youtubeId, youtubeDetails);

    expect(collection).toHaveBeenCalledWith(
      process.env.FIRESTORE_ROOT_COLLECTION
    );
    expect(doc).toHaveBeenCalledWith(youtubeId);
    expect(set).toHaveBeenCalledWith(youtubeDetails);
  });
});
