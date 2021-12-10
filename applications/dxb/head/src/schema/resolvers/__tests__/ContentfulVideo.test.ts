import axios from "axios";
import ContentfulVideo from "../ContentfulVideo";
import { Node } from "../types";

const source: Node = {
  id: "source",
  internal: null,
  children: null,
  parent: null,
  youtubeId: "youtubeId"
};

jest.mock("dotenv");

jest.mock("googleapis", () => ({
  google: {
    youtube: jest.fn().mockReturnValue({
      videos: {
        list: jest.fn().mockImplementation(({ id: [youtubeId] }) => {
          if (!youtubeId) {
            return { data: null };
          }
          return {
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
          };
        })
      }
    })
  }
}));

jest.mock("axios");

describe("ContentfulVideo resolver", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "test";
    process.env.GOOGLE_YOUTUBE_API_KEY = "";
    process.env.ENABLE_YOUTUBE_CACHE = "";
    process.env.YOUTUBE_CACHE_API_URL = "";
    process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET = "";
  });

  it("should throw error if no GOOGLE_YOUTUBE_API_KEY provided for production", async () => {
    process.env.NODE_ENV = "production";
    await expect(ContentfulVideo.videoRatio.resolve(source)).rejects.toThrow(
      "resolvers.ContentfulVideo: GOOGLE_YOUTUBE_API_KEY is missing."
    );
  });
  it("should resolve default ratio if no GOOGLE_YOUTUBE_API_KEY provided", async () => {
    expect(await ContentfulVideo.videoRatio.resolve(source)).toEqual({
      height: 16,
      width: 9
    });
  });
  it("should resolve null if youtube.videos.list data is null", async () => {
    process.env.GOOGLE_YOUTUBE_API_KEY = "GOOGLE_YOUTUBE_API_KEY";
    expect(
      await ContentfulVideo.videoRatio.resolve({ ...source, youtubeId: null })
    ).toBeNull();
  });

  it("should resolve video ratio if no ENABLE_YOUTUBE_CACHE provided", async () => {
    process.env.GOOGLE_YOUTUBE_API_KEY = "GOOGLE_YOUTUBE_API_KEY";
    expect(await ContentfulVideo.videoRatio.resolve(source)).toEqual({
      height: 20.4,
      width: 16.8
    });
  });

  it("should throw error if no YOUTUBE_CACHE_API_URL provided", async () => {
    process.env.ENABLE_YOUTUBE_CACHE = "ENABLE_YOUTUBE_CACHE";
    await expect(ContentfulVideo.videoRatio.resolve(source)).rejects.toThrow(
      "resolvers.ContentfulVideo: YOUTUBE_CACHE_API_URL is missing."
    );
  });

  it("should throw error if no YOUTUBE_CACHE_BEARER_TOKEN_SECRET provided", async () => {
    process.env.ENABLE_YOUTUBE_CACHE = "ENABLE_YOUTUBE_CACHE";
    process.env.YOUTUBE_CACHE_API_URL = "YOUTUBE_CACHE_API_URL";
    await expect(ContentfulVideo.videoRatio.resolve(source)).rejects.toThrow(
      "resolvers.ContentfulVideo: YOUTUBE_CACHE_BEARER_TOKEN_SECRET is missing."
    );
  });

  it("should resolve video ratio", async () => {
    process.env.ENABLE_YOUTUBE_CACHE = "ENABLE_YOUTUBE_CACHE";
    process.env.YOUTUBE_CACHE_API_URL = "YOUTUBE_CACHE_API_URL";
    process.env.YOUTUBE_CACHE_BEARER_TOKEN_SECRET =
      "YOUTUBE_CACHE_BEARER_TOKEN_SECRET";
    jest.spyOn(axios, "get").mockResolvedValue({
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

    expect(await ContentfulVideo.videoRatio.resolve(source)).toEqual({
      height: 20.4,
      width: 16.8
    });
    expect(axios.get).toHaveBeenCalledWith(
      "YOUTUBE_CACHE_API_URL?youtubeId=youtubeId",
      { headers: { Authorization: "Bearer YOUTUBE_CACHE_BEARER_TOKEN_SECRET" } }
    );
  });
});
