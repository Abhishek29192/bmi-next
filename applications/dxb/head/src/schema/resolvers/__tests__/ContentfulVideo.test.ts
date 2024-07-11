import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";
import { youtube_v3 } from "googleapis/build/src/apis/youtube/v3";
import createContentfulVideoData from "../types/helpers/ContetfulVideoHelper";
import resolveContentfulVideo from "../ContentfulVideo";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import type { Data as ContentfulImageData } from "../../../components/image/contentful-image/types";

const youtubeList = jest.fn();
jest.mock("googleapis", () => ({
  google: {
    youtube: jest.fn().mockReturnValue({
      videos: {
        list: (
          ...args: Parameters<typeof youtube_v3.Youtube.prototype.videos.list>
        ) => youtubeList(...args)
      }
    })
  }
}));

jest.mock("../utils/getDefaultYoutubePreviewImage", () => ({
  getDefaultYoutubePreviewImage: () =>
    "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg"
}));

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof fetchMock>) => fetchMock(...args)
}));

const imageResolverMock = jest.fn();
jest.mock("../ContentfulImage", () => ({
  __esModule: true,
  default: (image: ContentfulImageData) => imageResolverMock(image)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
});

describe("ContentfulVideo resolver", () => {
  describe("videoRatio", () => {
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

        await expect(
          resolveContentfulVideo(createContentfulVideoData())
        ).rejects.toThrow(
          "resolvers.ContentfulVideo: YOUTUBE_CACHE_API_URL is missing."
        );

        expect(fetchMock).not.toHaveBeenCalled();

        process.env.YOUTUBE_CACHE_API_URL = originalYoutubeCacheApiUrl;
      });

      it("should throw error if no YOUTUBE_CACHE_BEARER_TOKEN_SECRET provided", async () => {
        const originalYoutubeCacheBearerTokenSecret =
          process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET;
        delete process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET;

        await expect(
          resolveContentfulVideo(createContentfulVideoData())
        ).rejects.toThrow(
          "resolvers.ContentfulVideo: YOUTUBE_CACHE_BEARER_TOKEN_SECRET is missing."
        );

        expect(fetchMock).not.toHaveBeenCalled();

        process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET =
          originalYoutubeCacheBearerTokenSecret;
      });

      it("should retry up to 5 times to resolve video ratio if 429 returned", async () => {
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        const expectedUrl = `${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${video.youtubeId}`;
        mockResponses(fetchMock, {
          url: expectedUrl,
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET}`
          },
          status: 429
        });

        try {
          await resolveContentfulVideo(video);
          expect(false).toEqual("An error should have been thrown");
        } catch (error) {
          expect((error as Error).message).toStrictEqual(
            `Failed request for "${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${video.youtubeId}" after 5 retries with the following errors: ["Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - ","Too Many Requests - "]`
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
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        const expectedUrl = `${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${video.youtubeId}`;
        mockResponses(fetchMock, {
          url: expectedUrl,
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET}`
          },
          status: 500
        });

        try {
          await resolveContentfulVideo(video);
          expect(false).toEqual("An error should have been thrown");
        } catch (error) {
          expect((error as Error).message).toStrictEqual(
            `Failed request for "${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${video.youtubeId}" after 1 retries with the following errors: ["Internal Server Error - "]`
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
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        const expectedUrl = `https://youtube_cache_api_url/?youtubeId=${video.youtubeId}`;
        mockResponses(fetchMock, {
          url: expectedUrl,
          method: "GET",
          headers: {
            Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET"
          },
          status: 404
        });

        try {
          await resolveContentfulVideo(video);
          expect(false).toEqual("An error should have been thrown");
        } catch (error) {
          expect((error as Error).message).toStrictEqual(
            `Failed request for "${process.env.YOUTUBE_CACHE_API_URL}?youtubeId=${video.youtubeId}" after 1 retries with the following errors: ["Not Found - "]`
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
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        const expectedUrl = `https://youtube_cache_api_url/?youtubeId=${video.youtubeId}`;
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

        const resolvedVideo = await resolveContentfulVideo(video);
        expect(resolvedVideo.videoRatio).toEqual({
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
        process.env.NEXT_PUBLIC_YOUTUBE_API_KEY = "GOOGLE_YOUTUBE_API_KEY";
      });

      afterEach(() => {
        expect(fetchMock).not.toHaveBeenCalled();
      });

      it("should throw error if no GOOGLE_YOUTUBE_API_KEY provided", async () => {
        const originalGoogleYoutubeApiKey = process.env.GOOGLE_YOUTUBE_API_KEY;
        delete process.env.GOOGLE_YOUTUBE_API_KEY;

        await expect(
          resolveContentfulVideo(createContentfulVideoData())
        ).rejects.toThrow(
          "resolvers.ContentfulVideo: GOOGLE_YOUTUBE_API_KEY is missing."
        );

        expect(youtubeList).not.toHaveBeenCalled();

        process.env.GOOGLE_YOUTUBE_API_KEY = originalGoogleYoutubeApiKey;
      });

      it("should return null if youtube.videos.list data is undefined", async () => {
        youtubeList.mockResolvedValueOnce({ data: undefined });
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        const resolvedVideo = await resolveContentfulVideo(video);

        expect(resolvedVideo.videoRatio).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [video.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return null if youtube.videos.list data items is undefined", async () => {
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        youtubeList.mockResolvedValueOnce({ data: { items: undefined } });

        const resolvedVideo = await resolveContentfulVideo(video);
        expect(resolvedVideo.videoRatio).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [video.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return null if youtube.videos.list data items is an empty array", async () => {
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        youtubeList.mockResolvedValueOnce({ data: { items: [] } });

        const resolvedVideo = await resolveContentfulVideo(video);
        expect(resolvedVideo.videoRatio).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [video.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return null if youtube.videos.list data item has null embedHeight", async () => {
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        youtubeList.mockResolvedValueOnce({
          data: { items: [{ player: { embedHeight: null, embedWidth: "16" } }] }
        });

        const resolvedVideo = await resolveContentfulVideo(video);
        expect(resolvedVideo.videoRatio).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [video.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return null if youtube.videos.list data item has null embedWidth", async () => {
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        youtubeList.mockResolvedValueOnce({
          data: { items: [{ player: { embedHeight: "9", embedWidth: null } }] }
        });

        const resolvedVideo = await resolveContentfulVideo(video);
        expect(resolvedVideo.videoRatio).toBeNull();

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [video.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return height and width if youtube.videos.list data item has embedHeight and embedWidth", async () => {
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        youtubeList.mockResolvedValueOnce({
          data: { items: [{ player: { embedHeight: "9", embedWidth: "16" } }] }
        });

        const resolvedVideo = await resolveContentfulVideo(video);
        expect(resolvedVideo.videoRatio).toEqual({
          height: 9,
          width: 16
        });

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [video.youtubeId],
          maxHeight: 9999
        });
      });

      it("should return height and width from YouTube API if ENABLE_YOUTUBE_CACHE is not set", async () => {
        const video = createContentfulVideoData({ youtubeId: "youtubeId" });
        const originalEnableYoutubeCache = process.env.ENABLE_YOUTUBE_CACHE;
        delete process.env.ENABLE_YOUTUBE_CACHE;

        youtubeList.mockResolvedValueOnce({
          data: { items: [{ player: { embedHeight: "9", embedWidth: "16" } }] }
        });

        const resolvedVideo = await resolveContentfulVideo(video);
        expect(resolvedVideo.videoRatio).toEqual({
          height: 9,
          width: 16
        });

        expect(youtubeList).toHaveBeenCalledWith({
          part: ["snippet", "player", "status"],
          fields:
            "items(id,player(embedHeight,embedWidth),snippet(thumbnails),status(uploadStatus))",
          id: [video.youtubeId],
          maxHeight: 9999
        });

        process.env.ENABLE_YOUTUBE_CACHE = originalEnableYoutubeCache;
      });
    });
  });

  describe("videoUrl", () => {
    beforeEach(() => {
      youtubeList.mockResolvedValueOnce({
        data: { items: [{ player: { embedHeight: "9", embedWidth: "16" } }] }
      });
    });

    it("should resolve with templated youtube video url", async () => {
      const resolvedVideo = await resolveContentfulVideo(
        createContentfulVideoData({ youtubeId: "youtubeId" })
      );
      expect(resolvedVideo.videoUrl).toEqual(
        "https://www.youtube.com/watch?v=youtubeId"
      );
    });

    it("should resolve with provided youtube video url", async () => {
      const resolvedVideo = await resolveContentfulVideo(
        createContentfulVideoData({
          youtubeId:
            "https://youtu.be/01SUXJmB9Ik?utm_medium=cpc&utm_source=google_search&_bmitiles=uk"
        })
      );

      expect(resolvedVideo.videoUrl).toEqual(
        "https://youtu.be/01SUXJmB9Ik?utm_medium=cpc&utm_source=google_search&_bmitiles=uk"
      );
    });
  });

  describe("defaultYouTubePreviewImage", () => {
    beforeEach(() => {
      youtubeList.mockResolvedValueOnce({
        data: { items: [{ player: { embedHeight: "9", embedWidth: "16" } }] }
      });
    });

    it("should return correct image source if url provided and this image exists on youtube", async () => {
      const resolvedVideo = await resolveContentfulVideo(
        createContentfulVideoData()
      );
      expect(resolvedVideo.defaultYouTubePreviewImage).toBe(
        "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg"
      );
    });
  });

  describe("previewMedia", () => {
    beforeEach(() => {
      youtubeList.mockResolvedValueOnce({
        data: { items: [{ player: { embedHeight: "9", embedWidth: "16" } }] }
      });
      imageResolverMock.mockReturnValue("resolved-image");
    });

    it("should return null if previewMedia is not provided", async () => {
      const resolvedVideo = await resolveContentfulVideo(
        createContentfulVideoData({ previewMedia: null })
      );
      expect(resolvedVideo.previewMedia).toBeNull();
      expect(imageResolverMock).not.toHaveBeenCalled();
    });

    it("should return resolved previewMedia if provided", async () => {
      const video = createContentfulVideoData({
        previewMedia: createImageData()
      });
      const resolvedVideo = await resolveContentfulVideo(video);
      expect(resolvedVideo.previewMedia).toBe("resolved-image");
      expect(imageResolverMock).toHaveBeenCalledWith(video.previewMedia);
    });
  });
});
