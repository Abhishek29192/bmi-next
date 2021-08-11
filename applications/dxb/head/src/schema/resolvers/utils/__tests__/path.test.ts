import React from "react";
import pathUtil from "../path";

describe("Path resolver util", () => {
  it("getUrlFromPath successfully gets url from path", () => {
    const testObject = [
      {
        path: "/en/i-am-a-test/path/thingy/?q=a",
        queryParams: "?q=1",
        slug: "/en/i-am-a-test/path/thingy/"
      }
    ];

    const url = pathUtil.getUrlFromPath(testObject);

    expect(url).toContain("/en/i-am-a-test/path/thingy/?q=1");
    expect(url).toMatchSnapshot();
  });

  it("resolvePath successfully resolves path", async () => {
    const testObject = [
      {
        slug: "/en/i-am-a-test/path/thingy/"
      }
    ];

    const url = await pathUtil.resolvePath(testObject);

    expect(url).toMatchSnapshot();
  });
});
