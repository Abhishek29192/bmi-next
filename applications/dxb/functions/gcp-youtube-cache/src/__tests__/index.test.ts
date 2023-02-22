import { mockResponse } from "@bmi-digital/fetch-mocks";
import { Request, Response } from "express";
import fetchMockJest from "fetch-mock-jest";
import mockConsole from "jest-mock-console";
import { Method, Status } from "simple-http-status";
import { getById, getYoutubeDetails, saveById } from "../db";
import createYoutubeVideoListResponse from "./YoutubeVideoListResponseHelper";

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);
jest.mock("../db");

const youtubeCache = async (
  request: Partial<Request>,
  response: Partial<Response>
) =>
  (await import("../index")).youtubeCache(
    request as Request,
    response as Response
  );

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
  it("should return 500 if FIRESTORE_ROOT_COLLECTION is not set", async () => {
    const firestoreRootCollection = process.env.FIRESTORE_ROOT_COLLECTION;
    delete process.env.FIRESTORE_ROOT_COLLECTION;

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.sendStatus).toBeCalledWith(
      Status.HTTP_500_INTERNAL_SERVER_ERROR
    );
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);

    process.env.FIRESTORE_ROOT_COLLECTION = firestoreRootCollection;
  });

  it("should return 500 if BEARER_TOKEN is not set", async () => {
    const bearerTokenSecret = process.env.BEARER_TOKEN;
    delete process.env.BEARER_TOKEN;

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.sendStatus).toBeCalledWith(
      Status.HTTP_500_INTERNAL_SERVER_ERROR
    );
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);

    process.env.BEARER_TOKEN = bearerTokenSecret;
  });

  it("should return 500 if GOOGLE_YOUTUBE_API_KEY is not set", async () => {
    const googleYoutubeApiKeySecret = process.env.GOOGLE_YOUTUBE_API_KEY;
    delete process.env.GOOGLE_YOUTUBE_API_KEY;

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.sendStatus).toBeCalledWith(
      Status.HTTP_500_INTERNAL_SERVER_ERROR
    );
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);

    process.env.GOOGLE_YOUTUBE_API_KEY = googleYoutubeApiKeySecret;
  });

  it("should ask for a defaultYoutubeId", async () => {
    const { res } = await createRequest(undefined, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_400_BAD_REQUEST);
    expect(res.send).toBeCalledWith({
      message: "youtubeId query param is required."
    });
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  it("should ask for a valid token", async () => {
    const { res } = await createRequest(youtubeId, "invalid-token");

    expect(res.status).toBeCalledWith(Status.HTTP_401_UNAUTHORIZED);
    expect(res.send).toBeCalledWith({
      message: "Please provide a valid access token."
    });
    expect(getById).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  it("should return the cached youtube details", async () => {
    const mockYoutubeResponse = createYoutubeVideoListResponse();
    (getById as jest.Mock).mockImplementation(async () => mockYoutubeResponse);

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_200_OK);
    expect(res.send).toBeCalledWith(mockYoutubeResponse);
    expect(getById).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(0);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
  });

  it("should cache and then return the details", async () => {
    const mockYoutubeResponse = createYoutubeVideoListResponse();
    (getById as jest.Mock).mockImplementation(async () => undefined);
    (getYoutubeDetails as jest.Mock).mockImplementation(
      async () => mockYoutubeResponse
    );

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_201_CREATED);
    expect(res.send).toBeCalledWith(mockYoutubeResponse);
    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(1);
  });

  it("should not find the youtube video details", async () => {
    (getYoutubeDetails as jest.Mock).mockImplementation(async () => undefined);

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_404_NOT_FOUND);
    expect(res.send).toBeCalledWith({
      message: 'Youtube video with id: "foo" not found.'
    });
    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(1);
    expect(saveById).toHaveBeenCalledTimes(0);
  });

  it("should return 500 error", async () => {
    (getById as jest.Mock).mockImplementation(async () => {
      throw new Error("random error");
    });

    const { res } = await createRequest(youtubeId, bearerToken);

    expect(res.status).toBeCalledWith(Status.HTTP_500_INTERNAL_SERVER_ERROR);
    expect(res.send).toBeCalledWith({
      message: "Something went wrong, try again later."
    });
    expect(getById).toHaveBeenCalledTimes(1);
    expect(getYoutubeDetails).toHaveBeenCalledTimes(0);
    expect(saveById).toHaveBeenCalledTimes(0);
  });
});
