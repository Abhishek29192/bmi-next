import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest, { mockClear } from "fetch-mock-jest";

const defaultYouTubePreviewImageResolve = async (videoId: string) =>
  (
    await import("../getDefaultYoutubePreviewImage")
  ).getDefaultYoutubePreviewImage(videoId);

const fetchMock = fetchMockJest.sandbox();
jest.mock("node-fetch", () => fetchMock);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  fetchMock.reset();
  mockClear();
});

const expectedUrl = "https://i.ytimg.com/vi/youtubeId";

const mockedGoogleResponses = [
  {
    url: `${expectedUrl}/maxresdefault.jpg`,
    method: "GET",
    status: 200
  },
  {
    url: `${expectedUrl}/hqdefault.jpg`,
    method: "GET",
    status: 200
  },
  {
    url: `${expectedUrl}/mqdefault.jpg`,
    method: "GET",
    status: 200
  },
  {
    url: `${expectedUrl}/sqdefault.jpg`,
    method: "GET",
    status: 200
  },
  {
    url: `${expectedUrl}/default.jpg`,
    method: "GET",
    status: 200
  }
];

describe("defaultYouTubePreviewImage", () => {
  it("should return correct image source if url provided and this image exists on youtube", async () => {
    const expectedUrl = "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg";
    mockResponses(fetchMock, mockedGoogleResponses[0]);
    const result = await defaultYouTubePreviewImageResolve(
      "https://youtu.be/youtubeId"
    );
    expect(result).toEqual(expectedUrl);
  });

  it("should return next image if first image does not exist on youtube", async () => {
    mockedGoogleResponses[0].status = 404;
    mockResponses(fetchMock, ...mockedGoogleResponses);
    expect(
      await defaultYouTubePreviewImageResolve("https://youtu.be/youtubeId")
    ).toEqual(`${expectedUrl}/hqdefault.jpg`);
  });

  it("should return next image if second image does not exist on youtube", async () => {
    mockedGoogleResponses[0].status = 404;
    mockedGoogleResponses[1].status = 404;
    mockResponses(fetchMock, ...mockedGoogleResponses);
    expect(
      await defaultYouTubePreviewImageResolve("https://youtu.be/youtubeId")
    ).toEqual(`${expectedUrl}/mqdefault.jpg`);
  });
  it("should return next image if third image does not exist on youtube", async () => {
    mockedGoogleResponses[0].status = 404;
    mockedGoogleResponses[1].status = 404;
    mockedGoogleResponses[2].status = 404;
    mockResponses(fetchMock, ...mockedGoogleResponses);
    expect(
      await defaultYouTubePreviewImageResolve("https://youtu.be/youtubeId")
    ).toEqual(`${expectedUrl}/sqdefault.jpg`);
  });
  it("should return next image if fourth image does not exist on youtube", async () => {
    mockedGoogleResponses[0].status = 404;
    mockedGoogleResponses[1].status = 404;
    mockedGoogleResponses[2].status = 404;
    mockedGoogleResponses[3].status = 404;
    mockResponses(fetchMock, ...mockedGoogleResponses);
    expect(
      await defaultYouTubePreviewImageResolve("https://youtu.be/youtubeId")
    ).toEqual(`${expectedUrl}/default.jpg`);
  });
  it("should return an empty string if no one of images exists on youtube", async () => {
    mockedGoogleResponses[0].status = 404;
    mockedGoogleResponses[1].status = 404;
    mockedGoogleResponses[2].status = 404;
    mockedGoogleResponses[3].status = 404;
    mockedGoogleResponses[4].status = 404;
    mockResponses(fetchMock, ...mockedGoogleResponses);
    expect(
      await defaultYouTubePreviewImageResolve("https://youtu.be/youtubeId")
    ).toEqual("");
  });

  it("should return correct image source if id provided and this image exists on youtube", async () => {
    const expectedUrl = "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg";
    mockResponses(fetchMock, {
      url: expectedUrl,
      method: "GET",
      status: 200
    });
    expect(await defaultYouTubePreviewImageResolve("youtubeId")).toEqual(
      expectedUrl
    );
  });

  it("should log en error if fetch is failed", async () => {
    const expectedUrl = "https://i.ytimg.com/vi/youtubeId/maxresdefault.jpg";
    console.log = jest.fn();
    mockResponses(fetchMock, {
      url: expectedUrl,
      method: "GET",
      status: 500,
      error: new Error("Internal server error")
    });
    expect(await defaultYouTubePreviewImageResolve("youtubeId")).toEqual("");
    expect(console.log).toHaveBeenCalledWith("Internal server error");
  });
});
