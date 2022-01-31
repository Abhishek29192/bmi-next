import { Method, Status } from "simple-http-status";
import { youtube_v3 } from "googleapis";
import mockConsole from "jest-mock-console";
import fetchMockJest from "fetch-mock-jest";
import { Request, Response } from "express";
import { mockResponse } from "@bmi/fetch-mocks";
import { getById, saveById, getYoutubeDetails } from "../db";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);
const getSecret = jest.fn();
jest.mock("@bmi/functions-secret-client", () => {
  return { getSecret };
});
jest.mock("../db");

const youtubeCache = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  (await import("../index")).youtubeCache(
    request as Request,
    response as Response
  );

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
const bearerToken = "valid-token";

const createRequest = async (
  youtubeId: string | undefined,
  bearerToken: string
) => {
  const headers = bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {};

  const query = youtubeId ? { youtubeId } : {};

  const res = mockResponse();

  const req: Partial<Request> = {
    url: "/",
    method: Method.GET,
    query,
    headers
  };

  await youtubeCache(req, res);

  return { res, req };
};

beforeEach(() => {
  mockConsole();
  jest.resetAllMocks();
  fetchMock.reset();
});

describe("youtubeCache", function () {
  test("should return 500 if FIRESTORE_ROOT_COLLECTION is not set", async () => {
    const firestoreRootCollection = process.env.FIRESTORE_ROOT_COLLECTION;
    delete process.env.FIRESTORE_ROOT_COLLECTION;

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.sendStatus).toBeCalledWith(
      Status.HTTP_500_INTERNAL_SERVER_ERROR
    );
    expect(getSecret).not.toHaveBeenCalled();
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);

    process.env.FIRESTORE_ROOT_COLLECTION = firestoreRootCollection;
  });

  test("should ask for a defaultYoutubeId", async () => {
    getSecret.mockResolvedValue(bearerToken);

    const { res } = await createRequest(undefined, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_400_BAD_REQUEST);
    expect(res.send).toBeCalledWith({
      message: "youtubeId query param is required."
    });
    expect(getSecret).toHaveBeenCalledWith("bearerTokenSecret");
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  test("should return 500 when getSecret throws error", async () => {
    getSecret.mockRejectedValue(new Error("Expected error"));

    const { res } = await createRequest(youtubeId, "invalid-token");

    expect(res.status).toBeCalledWith(Status.HTTP_500_INTERNAL_SERVER_ERROR);
    expect(res.send).toBeCalledWith({
      message: "Something went wrong, try again later."
    });
    expect(getSecret).toHaveBeenCalledWith("bearerTokenSecret");
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  test("should ask for a valid token", async () => {
    getSecret.mockResolvedValue(bearerToken);

    const { res } = await createRequest(youtubeId, "invalid-token");

    expect(res.status).toBeCalledWith(Status.HTTP_401_UNAUTHORIZED);
    expect(res.send).toBeCalledWith({
      message: "Please provide a valid access token."
    });
    expect(getSecret).toHaveBeenCalledWith("bearerTokenSecret");
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  test("should return the cached youtube details", async () => {
    getSecret.mockResolvedValue(bearerToken);
    (getById as jest.Mock).mockImplementation(async () => mockYoutubeDetails);

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_200_OK);
    expect(res.send).toBeCalledWith(mockYoutubeDetails);
    expect(getSecret).toHaveBeenCalledWith("bearerTokenSecret");
    expect(getById).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  test("should cache and then return the details", async () => {
    getSecret.mockResolvedValue(bearerToken);
    (getById as jest.Mock).mockImplementation(async () => undefined);
    (getYoutubeDetails as jest.Mock).mockImplementation(
      async () => mockYoutubeDetails
    );

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_201_CREATED);
    expect(res.send).toBeCalledWith(mockYoutubeDetails);
    expect(getSecret).toHaveBeenCalledWith("bearerTokenSecret");
    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(1);
  });

  test("should not find the youtube video details", async () => {
    getSecret.mockResolvedValue(bearerToken);
    (getYoutubeDetails as jest.Mock).mockImplementation(async () => ({
      ...mockYoutubeDetails,
      items: []
    }));

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_404_NOT_FOUND);
    expect(res.send).toBeCalledWith({
      message: 'Youtube video with id: "foo" not found.'
    });
    expect(getSecret).toHaveBeenCalledWith("bearerTokenSecret");
    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(0);
  });

  test("should return 500 error", async () => {
    getSecret.mockResolvedValue(bearerToken);
    (getById as jest.Mock).mockImplementation(async () => {
      throw new Error("random error");
    });

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_500_INTERNAL_SERVER_ERROR);
    expect(res.send).toBeCalledWith({
      message: "Something went wrong, try again later."
    });
    expect(getSecret).toHaveBeenCalledWith("bearerTokenSecret");
    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
  });
});
