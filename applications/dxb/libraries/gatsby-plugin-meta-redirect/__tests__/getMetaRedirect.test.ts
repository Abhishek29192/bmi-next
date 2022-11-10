import getMetaRedirect from "../getMetaRedirect";

describe("getMetaRedirect", () => {
  it("wraps path in forward slashes", () => {
    expect(getMetaRedirect("toPath")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/toPath/\'" />'
    );
  });

  it("allows existing leading and trailing forward slashes", () => {
    expect(getMetaRedirect("/toPath/")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/toPath/\'" />'
    );
  });

  it("trims leading and trailing whitespace", () => {
    expect(getMetaRedirect(" toPath ")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/toPath/\'" />'
    );
  });

  it("handles deep paths", () => {
    expect(getMetaRedirect("a/b/c/d")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/a/b/c/d/\'" />'
    );
  });

  it("handles offset wrapping forward slashes", () => {
    expect(getMetaRedirect("a/b/c/")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/a/b/c/\'" />'
    );
  });

  it("replaces duplicate slashes with single slash", () => {
    expect(getMetaRedirect("topath//a")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/topath/a/\'" />'
    );
  });

  it("should return meta tag with correct content attribute if isPermanent is true", () => {
    expect(getMetaRedirect("toPath", true)).toStrictEqual(
      '<meta http-equiv="refresh" content="0; URL=\'/toPath/\'" />'
    );
  });

  it("leaves full urls untouched", () => {
    expect(getMetaRedirect("http://example.com")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'http://example.com\'" />'
    );
    expect(getMetaRedirect("http://example.com/")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'http://example.com/\'" />'
    );
    expect(getMetaRedirect("http://example.com/a/b/c")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'http://example.com/a/b/c\'" />'
    );
  });

  it("handles redirecting to root", () => {
    expect(getMetaRedirect("/")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/\'" />'
    );
  });

  it("handles redirecting to a file", () => {
    expect(getMetaRedirect("/test.txt")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/test.txt\'" />'
    );
  });

  it("handles redirecting to a file in a folder", () => {
    expect(getMetaRedirect("a/b/test.txt")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/a/b/test.txt\'" />'
    );
  });

  it("handles redirecting to a directory with query params", () => {
    expect(getMetaRedirect("a/b/c/?query=d")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/a/b/c/?query=d\'" />'
    );
  });

  it("handles redirecting to a directory without trailing slash with query params", () => {
    expect(getMetaRedirect("a/b/c?query=d")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/a/b/c/?query=d\'" />'
    );
  });

  it("handles redirecting to a file with query params", () => {
    expect(getMetaRedirect("a/b/test.txt?query=d")).toStrictEqual(
      '<meta http-equiv="refresh" content="1; URL=\'/a/b/test.txt?query=d\'" />'
    );
  });
});
