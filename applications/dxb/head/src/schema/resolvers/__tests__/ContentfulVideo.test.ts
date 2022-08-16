import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest, { mockClear } from "fetch-mock-jest";
import { Node } from "../types/Gatsby";

const source: Node = {
  id: "source",
  internal: null,
  children: null,
  parent: null,
  youtubeId: "youtubeId"
};

jest.mock("dotenv");

const youtubeList = jest.fn();
jest.mock("googleapis", () => ({
  google: {
    youtube: jest.fn().mockReturnValue({
      videos: {
        list: youtubeList
      }
    })
  }
}));

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

const videoRatioResolve = async (source: Node) =>
  (await import("../ContentfulVideo")).default.videoRatio.resolve(source);

const youtubeIdResolve = async (source: Node) =>
  (await import("../ContentfulVideo")).default.youtubeId.resolve(source);

beforeEach(() => {
  process.env.NODE_ENV = "test";
  process.env.GOOGLE_YOUTUBE_API_KEY = "";
  process.env.ENABLE_YOUTUBE_CACHE = "";
  process.env.YOUTUBE_CACHE_API_URL = "";
  process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET = "";
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
  mockClear();
});

describe("ContentfulVideo", () => {
  describe("videoRatio resolver", () => {
    it("should throw error if no GOOGLE_YOUTUBE_API_KEY provided for production", async () => {
      process.env.NODE_ENV = "production";
      await expect(videoRatioResolve(source)).rejects.toThrow(
        "resolvers.ContentfulVideo: GOOGLE_YOUTUBE_API_KEY is missing."
      );
    });
    it("should resolve default ratio if no GOOGLE_YOUTUBE_API_KEY provided", async () => {
      expect(await videoRatioResolve(source)).toEqual({
        height: 16,
        width: 9
      });
    });
    it("should resolve null if youtube.videos.list data is null", async () => {
      process.env.GOOGLE_YOUTUBE_API_KEY = "GOOGLE_YOUTUBE_API_KEY";

      youtubeList.mockResolvedValueOnce({ data: null });

      expect(await videoRatioResolve(source)).toBeNull();

      expect(youtubeList).toHaveBeenCalledWith({
        part: ["player"],
        id: [source.youtubeId],
        maxHeight: 9999
      });
    });

    it("should resolve video ratio if no ENABLE_YOUTUBE_CACHE provided", async () => {
      process.env.GOOGLE_YOUTUBE_API_KEY = "GOOGLE_YOUTUBE_API_KEY";
      youtubeList.mockResolvedValueOnce({
        data: {
          items: [
            {
              player: {
                embedHeight: "20.4",
                embedWidth: "16.8"
              }
            }
          ]
        }
      });
      expect(await videoRatioResolve(source)).toEqual({
        height: 20.4,
        width: 16.8
      });
      expect(youtubeList).toHaveBeenCalledWith({
        part: ["player"],
        id: [source.youtubeId],
        maxHeight: 9999
      });
    });

    it("should throw error if no YOUTUBE_CACHE_API_URL provided", async () => {
      process.env.ENABLE_YOUTUBE_CACHE = "true";
      await expect(videoRatioResolve(source)).rejects.toThrow(
        "resolvers.ContentfulVideo: YOUTUBE_CACHE_API_URL is missing."
      );
    });

    it("should throw error if no YOUTUBE_CACHE_BEARER_TOKEN_SECRET provided", async () => {
      process.env.ENABLE_YOUTUBE_CACHE = "true";
      process.env.YOUTUBE_CACHE_API_URL = "https://youtube_cache_api_url";
      await expect(videoRatioResolve(source)).rejects.toThrow(
        "resolvers.ContentfulVideo: YOUTUBE_CACHE_BEARER_TOKEN_SECRET is missing."
      );
    });

    it("should resolve video ratio", async () => {
      process.env.ENABLE_YOUTUBE_CACHE = "true";
      process.env.YOUTUBE_CACHE_API_URL = "https://youtube_cache_api_url";
      process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET =
        "YOUTUBE_CACHE_BEARER_TOKEN_SECRET";
      const expectedUrl = `https://youtube_cache_api_url/?youtubeId=${source.youtubeId}`;
      mockResponses(fetchMock, {
        url: expectedUrl,
        method: "GET",
        headers: {
          Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
        },
        body: JSON.stringify({
          items: [
            {
              player: {
                embedHeight: "20.4",
                embedWidth: "16.8"
              }
            }
          ]
        })
      });

      expect(await videoRatioResolve(source)).toEqual({
        height: 20.4,
        width: 16.8
      });
      expect(fetchMock).toHaveFetched(expectedUrl, {
        method: "GET",
        headers: {
          Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
        }
      });
    });

    it("should retry up to 5 times to resolve video ratio if 429 returned", async () => {
      process.env.ENABLE_YOUTUBE_CACHE = "true";
      process.env.YOUTUBE_CACHE_API_URL = "https://youtube_cache_api_url";
      process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET =
        "YOUTUBE_CACHE_BEARER_TOKEN_SECRET";
      const expectedUrl = `https://youtube_cache_api_url/?youtubeId=${source.youtubeId}`;
      mockResponses(fetchMock, {
        url: expectedUrl,
        method: "GET",
        headers: {
          Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
        },
        status: 429
      });

      try {
        await videoRatioResolve(source);
        expect(false).toEqual("An error should have been thrown");
      } catch (error) {
        expect((error as Error).message).toStrictEqual(
          `Failed request for "https://youtube_cache_api_url?youtubeId=${source.youtubeId}" after 5 retries with the following errors: ["Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - "]`
        );
      }
      expect(fetchMock).toHaveFetchedTimes(5, expectedUrl, {
        method: "GET",
        headers: {
          Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
        }
      });
    });

    it("should error straight away if resolve video ratio returns error status", async () => {
      process.env.ENABLE_YOUTUBE_CACHE = "true";
      process.env.YOUTUBE_CACHE_API_URL = "https://youtube_cache_api_url";
      process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET =
        "YOUTUBE_CACHE_BEARER_TOKEN_SECRET";
      const expectedUrl = `https://youtube_cache_api_url/?youtubeId=${source.youtubeId}`;
      mockResponses(fetchMock, {
        url: expectedUrl,
        method: "GET",
        headers: {
          Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
        },
        status: 500
      });

      try {
        await videoRatioResolve(source);
        expect(false).toEqual("An error should have been thrown");
      } catch (error) {
        expect((error as Error).message).toStrictEqual(
          `Failed request for "https://youtube_cache_api_url?youtubeId=${source.youtubeId}" after 1 retries with the following errors: ["Internal Server Error - "]`
        );
      }
      expect(fetchMock).toHaveFetchedTimes(1, expectedUrl, {
        method: "GET",
        headers: {
          Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
        }
      });
    });
  });
  describe("youtubeId resolver", () => {
    it("should resolve with templated youtube video url", async () => {
      expect(await youtubeIdResolve(source)).toEqual(
        "https://www.youtube.com/watch?v=youtubeId"
      );
    });

    it("should resolve with provided youtube video url", async () => {
      const localSource = {
        ...source,
        youtubeId:
          "https://youtu.be/01SUXJmB9Ik?utm_medium=cpc&utm_source=google_search&_bmitiles=uk"
      };
      expect(await youtubeIdResolve(localSource)).toEqual(
        "https://youtu.be/01SUXJmB9Ik?utm_medium=cpc&utm_source=google_search&_bmitiles=uk"
      );
    });
  });
});
