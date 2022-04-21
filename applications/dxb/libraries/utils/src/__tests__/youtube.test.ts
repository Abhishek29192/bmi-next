import { getYoutubeId } from "../youtube";

describe("getYoutubeId", () => {
  it("returns ID for standard URL", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `https://www.youtube.com/watch?v=${expectedYoutubeId}`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for standard URL with start time", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `https://www.youtube.com/watch?v=${expectedYoutubeId}&t=10s`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for share link URL", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `https://youtu.be/${expectedYoutubeId}`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for share link URL with start time", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `https://youtu.be/${expectedYoutubeId}?t=10`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for embedded URL", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `https://www.youtube.com/embed/${expectedYoutubeId}`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for embedded URL with start time", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `https://www.youtube.com/embed/${expectedYoutubeId}?start=10`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for privacy-enhanced embedded URL", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `https://www.youtube-nocookie.com/embed/${expectedYoutubeId}`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for privacy-enhanced embedded URL with start time", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `https://www.youtube-nocookie.com/embed/${expectedYoutubeId}?start=10`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for URL without 'www.'", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `https://youtube.com/watch?v=${expectedYoutubeId}`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for URL without protocol", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `youtube.com/watch?v=${expectedYoutubeId}`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns ID for URL with http protocol", () => {
    const expectedYoutubeId = "HgeCkGZrPRs";
    const actualYoutubeId = getYoutubeId(
      `http://youtube.com/watch?v=${expectedYoutubeId}`
    );
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });

  it("returns passes through any value that doesn't match the regex", () => {
    const expectedYoutubeId = "djskhvjksdvjksdb";
    const actualYoutubeId = getYoutubeId(`djskhvjksdvjksdb`);
    expect(actualYoutubeId).toStrictEqual(expectedYoutubeId);
  });
});
