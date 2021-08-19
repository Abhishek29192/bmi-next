import { Method, Status } from "simple-http-status";
import { youtube_v3 } from "googleapis";
import mockConsole from "jest-mock-console";
import fetchMockJest from "fetch-mock-jest";
import { Request } from "express";

import { mockResponse } from "../../../../../../libraries/fetch-mocks/src/index";
import { youtubeCache } from "../index";
import { getById, saveById, getYoutubeDetails } from "../db";
import { getSecrets } from "../config";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);
jest.mock("../config");
jest.mock("../db");

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
  const secrets = await getSecrets();
  const headers = withCredentials
    ? { Authorization: `Bearer ${secrets.bearerTokenSecret}` }
    : {};

  const query = youtubeId ? { youtubeId } : {};

  const res = mockResponse();

  const req: Partial<Request> = {
    url: "/",
    method: Method.GET,
    query,
    headers
  };

  // @ts-expect-error
  await youtubeCache(req, res);

  return { res, req };
};

beforeEach(() => {
  mockConsole();
  jest.resetAllMocks();
  fetchMock.reset();
});

describe("youtubeCache", function () {
  test("should ask for a defaultYoutubeId", async () => {
    const { res } = await createRequest(undefined, true);

    expect(res.status).toBeCalledWith(Status.HTTP_400_BAD_REQUEST);
    expect(res.send).toBeCalledWith({
      message: "youtubeId query param is required."
    });
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  test("should ask for a valid token", async () => {
    const { res } = await createRequest(youtubeId, false);

    expect(res.status).toBeCalledWith(Status.HTTP_401_UNAUTHORIZED);
    expect(res.send).toBeCalledWith({
      message: "Please provide a valid access token."
    });
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  test("should return the cached youtube details", async () => {
    // @ts-expect-error
    getById.mockImplementation(async () => mockYoutubeDetails);
    const { res } = await createRequest(youtubeId, true);

    expect(res.status).toBeCalledWith(Status.HTTP_200_OK);
    expect(res.send).toBeCalledWith(mockYoutubeDetails);
    expect(getById).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  test("should cache and then return the details", async () => {
    // @ts-expect-error
    getById.mockImplementation(async () => undefined);
    // @ts-expect-error
    getYoutubeDetails.mockImplementation(async () => mockYoutubeDetails);
    const { res } = await createRequest(youtubeId, true);

    expect(res.status).toBeCalledWith(Status.HTTP_201_CREATED);
    expect(res.send).toBeCalledWith(mockYoutubeDetails);
    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(1);
  });

  test("should not find the youtube video details", async () => {
    // @ts-expect-error
    getYoutubeDetails.mockImplementation(async () => ({
      ...mockYoutubeDetails,
      items: []
    }));
    const { res } = await createRequest(youtubeId, true);

    expect(res.status).toBeCalledWith(Status.HTTP_404_NOT_FOUND);
    expect(res.send).toBeCalledWith({
      message: 'Youtube video with id: "foo" not found.'
    });
    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(0);
  });

  test("should return 500 error", async () => {
    // @ts-expect-error
    getById.mockImplementation(async () => {
      throw new Error("random error");
    });
    const { res } = await createRequest(youtubeId, true);

    expect(res.status).toBeCalledWith(Status.HTTP_500_INTERNAL_SERVER_ERROR);
    expect(res.send).toBeCalledWith({
      message: "Something went wrong, try again later."
    });
    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
  });
});
