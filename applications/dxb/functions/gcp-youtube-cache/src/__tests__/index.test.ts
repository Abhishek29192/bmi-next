import { createMocks } from "node-mocks-http";
import { Method, Status } from "simple-http-status";
import { youtube_v3 } from "googleapis";
import mockConsole from "jest-mock-console";

import { youtubeCache } from "../index";
import { getById, saveById, getYoutubeDetails } from "../db";
import { config } from "../config";

jest.mock("../db");
jest.mock("../config");

const mockYoutubeDetails: youtube_v3.Schema$VideoListResponse = {
  kind: "youtube#videoListResponse",
  etag: "MMuVhAEYSs0q8gWTpwuMBPKW-_g",
  items: [
    {
      kind: "youtube#video",
      etag: "fI4i9Q2cKMlrkWD8ZND74_pHBmA",
      id: "dQw4w9WgXcQ",
      player: {
        embedHtml:
          '<iframe width="17776" height="9999" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        embedHeight: "9999",
        embedWidth: "17776"
      }
    }
  ],
  pageInfo: {
    totalResults: 1,
    resultsPerPage: 1
  }
};

const youtubeId = "foo";

const createRequest = async (youtubeId: string, withCredentials: boolean) => {
  const headers = withCredentials
    ? { Authorization: `Bearer ${config.SECURITY_KEY}` }
    : {};

  const query = youtubeId ? { youtubeId } : {};

  const { req, res } = createMocks({
    url: "/",
    method: Method.GET,
    query,
    headers
  });

  await youtubeCache(req, res);

  return {
    statusCode: res._getStatusCode(),
    data: JSON.parse(res._getData())
  };
};

beforeEach(() => {
  mockConsole();
  jest.resetAllMocks();
});

describe("youtubeCache", function () {
  test("should ask for a defaultYoutubeId", async () => {
    const { statusCode, data } = await createRequest(null, true);

    expect(statusCode).toBe(Status.HTTP_400_BAD_REQUEST);
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
    expect(data).toEqual({
      message: "youtubeId query param is required."
    });
  });

  test("should ask for a valid token", async () => {
    const { statusCode, data } = await createRequest(youtubeId, false);

    expect(statusCode).toBe(Status.HTTP_401_UNAUTHORIZED);
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
    expect(data).toEqual({
      message: "Please provide a valid access token."
    });
  });

  test("should return the cached youtube details", async () => {
    // @ts-expect-error
    getById.mockImplementation(async () => mockYoutubeDetails);
    const { statusCode, data } = await createRequest(youtubeId, true);

    expect(getById).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
    expect(statusCode).toBe(Status.HTTP_200_OK);
    expect(data).toEqual(mockYoutubeDetails);
  });

  test("should cache and then return the details", async () => {
    // @ts-expect-error
    getById.mockImplementation(async () => null);
    // @ts-expect-error
    getYoutubeDetails.mockImplementation(async () => mockYoutubeDetails);
    const { statusCode, data } = await createRequest(youtubeId, true);

    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(Status.HTTP_201_CREATED);
    expect(data).toEqual(mockYoutubeDetails);
  });

  test("should not find the youtube video details", async () => {
    // @ts-expect-error
    getYoutubeDetails.mockImplementation(async () => ({
      ...mockYoutubeDetails,
      items: []
    }));
    const { statusCode, data } = await createRequest(youtubeId, true);

    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(statusCode).toBe(Status.HTTP_404_NOT_FOUND);
    expect(data).toEqual({
      message: 'Youtube video with id: "foo" not found.'
    });
  });

  test("should return 500 error", async () => {
    // @ts-expect-error
    getById.mockImplementation(async () => {
      throw new Error("random error");
    });
    const { statusCode, data } = await createRequest(youtubeId, true);

    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(statusCode).toBe(Status.HTTP_500_INTERNAL_SERVER_ERROR);
    expect(data).toEqual({
      message: "Something went wrong, try again later."
    });
  });
});
