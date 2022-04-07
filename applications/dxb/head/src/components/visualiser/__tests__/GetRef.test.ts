import getRef from "../GetRef";

describe("getRef", () => {
  it("should return undefined if ref without protocol", () => {
    const ref = "test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual(undefined);
  });
  it("should return undefined if no handler in schema", () => {
    const ref = "test://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual(undefined);
  });
  it("should return url for http protocol urls", () => {
    const ref = "http://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });

  it("should return url for https protocol urls", () => {
    const ref = "https://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for fa urls", () => {
    const ref = "fa://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for url protocol urls", () => {
    const ref = "url://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for fad protocol urls", () => {
    const ref = "fad://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for fas protocol urls", () => {
    const ref = "fas://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for far protocol urls", () => {
    const ref = "far://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for fal protocol urls", () => {
    const ref = "fal://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for fab protocol urls", () => {
    const ref = "fab://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for fr protocol urls", () => {
    const ref = "fr://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for emoji protocol urls", () => {
    const ref = "emoji://test-url.com";
    const result = getRef(ref, null);
    expect(result).toEqual("//test-url.com");
  });
  it("should return url for pablic protocol urls without options", () => {
    const ref = "public://part/part-2/file-part.file-type";
    const result = getRef(ref, null);
    expect(result).toEqual(
      "/content///part/part-2/file-part-original.file-type"
    );
  });
  it("should return url for pablic protocol urls with options", () => {
    const ref = "public:part.sub-part/part-2/file-part.file-type";
    const result = getRef(ref, {
      size: "default-size",
      contentSource: "source-test/",
      dirs: ["file-directory"],
      apiHost: "test-api-host://"
    });
    expect(result).toEqual(
      "test-api-host:////part.sub-part/content/part-2/file-directory/file-part-default-size.file-type"
    );
  });
  it("should return url for pablic protocol urls with options and hadServer = false", () => {
    const ref = "public:part/part-2/file-part.file-type";
    const result = getRef(ref, {
      size: "default-size",
      contentSource: "source-test/",
      dirs: ["file-directory"],
      apiHost: "test-api-host://"
    });
    expect(result).toEqual(
      "test-api-host://source-test//content/part/part-2/file-directory/file-part-default-size.file-type"
    );
  });
  it("should return url for private protocol urls with options and hadServer = false", () => {
    const ref = "private:part/part-2/file-part.file-type";
    const result = getRef(ref, {
      size: "default-size",
      contentSource: "source-test/",
      dirs: ["file-directory"],
      apiHost: "test-api-host://"
    });
    expect(result).toEqual(
      "test-api-host://source-test//content-private/part/part-2/file-directory/file-part-default-size.file-type"
    );
  });
  it("should return url for private protocol urls with mp4 options and hadServer = false", () => {
    const ref = "private:file-part.mp4";
    const result = getRef(ref, {
      size: "default-size",
      contentSource: "source-test/",
      dirs: ["file-directory"],
      apiHost: "test-api-host://"
    });
    expect(result).toEqual(
      "test-api-host://source-test//content-private/file-directory/file-part-original.mp4"
    );
  });
});
