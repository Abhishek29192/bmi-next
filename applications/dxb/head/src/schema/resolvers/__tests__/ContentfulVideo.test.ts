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

const defaultYouTubePreviewImageResolve = async (source: Node) =>
  (
    await import("../ContentfulVideo")
  ).default.defaultYouTubePreviewImage.resolve(source);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
  mockClear();
});

describe("ContentfulVideo", () => {
  describe("videoRatio resolver", () => {
    describe("get YouTube details from cache", () => {
      beforeEach(() => {
        process.env.ENABLE_YOUTUBE_CACHE = "true";
        process.env.YOUTUBE_CACHE_API_URL = "https://youtube_cache_api_url";
        process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET =
          "YOUTUBE_CACHE_BEARER_TOKEN_SECRET";
      });

      afterEach(() => {
        expect(youtubeList).not.toHaveBeenCalled();
      });

      it("should throw error if no YOUTUBE_CACHE_API_URL provided", async () => {
        const originalYoutubeCacheApiUrl = process.env.YOUTUBE_CACHE_API_URL;
        delete process.env.YOUTUBE_CACHE_API_URL;

        await expect(videoRatioResolve(source)).rejects.toThrow(
          "resolvers.ContentfulVideo: YOUTUBE_CACHE_API_URL is missing."
        );

        expect(fetchMock).not.toHaveBeenCalled();

        process.env.YOUTUBE_CACHE_API_URL = originalYoutubeCacheApiUrl;
      });

      it("should throw error if no YOUTUBE_CACHE_BEARER_TOKEN_SECRET provided", async () => {
        const originalYoutubeCacheBearerTokenSecret =
          process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET;
        delete process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET;

        await expect(videoRatioResolve(source)).rejects.toThrow(
          "resolvers.ContentfulVideo: YOUTUBE_CACHE_BEARER_TOKEN_SECRET is missing."
        );

        expect(fetchMock).not.toHaveBeenCalled();

        process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET =
          originalYoutubeCacheBearerTokenSecret;
      });

      it("should retry up to 5 times to resolve video ratio if 429 returned", async () => {
        const expectedUrl = `${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${source.youtubeId}`;
        mockResponses(fetchMock, {
          url: expectedUrl,
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET}`
          },
          status: 429
        });

        try {
          await videoRatioResolve(source);
          expect(false).toEqual("An error should have been thrown");
        } catch (error) {
          expect((error as Error).message).toStrictEqual(
            `Failed request for "${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${source.youtubeId}" after 5 retries with the following errors: ["Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - "]`
          );
        }
        expect(fetchMock).toHaveFetchedTimes(5, expectedUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET}`
          }
        });
      });

      it("should error straight away if resolve video ratio returns error status", async () => {
        const expectedUrl = `${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${source.youtubeId}`;
        mockResponses(fetchMock, {
          url: expectedUrl,
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET}`
          },
          status: 500
        });

        try {
          await videoRatioResolve(source);
          expect(false).toEqual("An error should have been thrown");
        } catch (error) {
          expect((error as Error).message).toStrictEqual(
            `Failed request for "${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${source.youtubeId}" after 1 retries with the following errors: ["Internal Server Error - "]`
          );
        }
        expect(fetchMock).toHaveFetchedTimes(1, expectedUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET}`
          }
        });
      });

      it("should error straight away if youtube video can't be found in cache", async () => {
        const expectedUrl = `https://youtube_cache_api_url/?youtubeId=${source.youtubeId}`;
        mockResponses(fetchMock, {
          url: expectedUrl,
          method: "GET",
          headers: {
            Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
          },
          status: 404
        });

        try {
          await videoRatioResolve(source);
          expect(false).toEqual("An error should have been thrown");
        } catch (error) {
          expect((error as Error).message).toStrictEqual(
            `Failed request for "${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${source.youtubeId}" after 1 retries with the following errors: ["Not Found - "]`
          );
        }
        expect(fetchMock).toHaveFetched(expectedUrl, {
          method: "GET",
          headers: {
            Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
          }
        });
      });

      it("should resolve video ratio", async () => {
        const expectedUrl = `https://youtube_cache_api_url/?youtubeId=${source.youtubeId}`;
        mockResponses(fetchMock, {
          url: expectedUrl,
          method: "GET",
          headers: {
            Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
          },
          body: JSON.stringify({
            embedHeight: 20.4,
            embedWidth: 16.8
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
    });

    describe("get YouTube details from YouTube API", () => {
      beforeEach(() => {
        process.env.ENABLE_YOUTUBE_CACHE = "false";
        process.env.GOOGLE_YOUTUBE_API_KEY = "GOOGLE_YOUTUBE_API_KEY";
      });

      afterEach(() => {
        expect(fetchMock).not.toHaveBeenCalled();
      });

      it("should throw error if no GOOGLE_YOUTUBE_API_KEY provided", async () => {
        const originalGoogleYoutubeApiKey = process.env.GOOGLE_YOUTUBE_API_KEY;
        delete process.env.GOOGLE_YOUTUBE_API_KEY;

        await expect(videoRatioResolve(source)).rejects.toThrow(
          "resolvers.ContentfulVideo: GOOGLE_YOUTUBE_API_KEY is missing."
        );

        expect(youtubeList).not.toHaveBeenCalled();

        process.env.GOOGLE_YOUTUBE_API_KEY = originalGoogleYoutubeApiKey;
      });

      it("should return null if youtube.videos.list data is undefined", async () => {
        youtubeList.mockResolvedValueOnce({ data: undefined });

        expect(await videoRatioResolve(source)).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [source.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return null if youtube.videos.list data items is undefined", async () => {
        youtubeList.mockResolvedValueOnce({ data: { items: undefined } });

        expect(await videoRatioResolve(source)).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [source.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return null if youtube.videos.list data items is an empty array", async () => {
        youtubeList.mockResolvedValueOnce({ data: { items: [] } });

        expect(await videoRatioResolve(source)).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [source.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return null if youtube.videos.list data item has null embedHeight", async () => {
        youtubeList.mockResolvedValueOnce({
          data: { items: [{ player: { embedHeight: null, embedWidth: "16" } }] }
        });

        expect(await videoRatioResolve(source)).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [source.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return null if youtube.videos.list data item has null embedWidth", async () => {
        youtubeList.mockResolvedValueOnce({
          data: { items: [{ player: { embedHeight: "9", embedWidth: null } }] }
        });

        expect(await videoRatioResolve(source)).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [source.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return height and width if youtube.videos.list data item has embedHeight and embedWidth", async () => {
        youtubeList.mockResolvedValueOnce({
          data: { items: [{ player: { embedHeight: "9", embedWidth: "16" } }] }
        });

        expect(await videoRatioResolve(source)).toEqual({
          height: 9,
          width: 16
        });

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [source.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return height and width from YouTube API if ENABLE_YOUTUBE_CACHE is not set", async () => {
        const originalEnableYoutubeCache = process.env.ENABLE_YOUTUBE_CACHE;
        delete process.env.ENABLE_YOUTUBE_CACHE;

        youtubeList.mockResolvedValueOnce({
          data: { items: [{ player: { embedHeight: "9", embedWidth: "16" } }] }
        });

        expect(await videoRatioResolve(source)).toEqual({
          height: 9,
          width: 16
        });

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [source.youtubeId],
          maxHeight: 9999
        });

        process.env.ENABLE_YOUTUBE_CACHE = originalEnableYoutubeCache;
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

  describe("defaultYouTubePreviewImage resolver", () => {
    it("should return correct image source if url provided and this image exists on youtube", async () => {
      jest.mock("../utils/getDefaultYoutubePreviewImage", () => ({
        getDefaultYoutubePreviewImage: () =>
          "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg"
      }));
      expect(await defaultYouTubePreviewImageResolve(source)).toEqual(
        "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg"
      );
    });
  });
});
