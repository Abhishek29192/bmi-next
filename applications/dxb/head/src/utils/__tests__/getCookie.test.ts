import getCookie from "../getCookie";

const cookieKey = "cookie-key";

describe("getCookie", () => {
  it("should return undefined if document is not available (SSG)", () => {
    document = undefined;
    const cookieValue = getCookie(cookieKey);
    expect(cookieValue).toBeUndefined();
  });

  it("should return undefined if cookie not found", () => {
    const cookieValue = getCookie(cookieKey);
    expect(cookieValue).toBeUndefined();
  });

  it("should return undefined if cookie found but with no value", () => {
    document.cookie = `${cookieKey}=`;
    const cookieValue = getCookie(cookieKey);
    expect(cookieValue).toBeUndefined();
  });

  it("should return value if cookie found with value", () => {
    document.cookie = `${cookieKey}=some value`;
    const cookieValue = getCookie(cookieKey);
    expect(cookieValue).toEqual("some value");
  });

  it("should return value if cookie found with more than 1 cookie present", () => {
    document.cookie = `${cookieKey}=some value;some-other-cookie=something`;
    const cookieValue = getCookie(cookieKey);
    expect(cookieValue).toEqual("some value");
  });
});
