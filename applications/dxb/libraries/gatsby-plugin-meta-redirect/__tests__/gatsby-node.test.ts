import { existsSync, readFileSync, rmSync } from "fs";
import { onPostBuild } from "../gatsby-node";

describe("onPostBuild", () => {
  const tempFolderPath = "./public";

  const assertRedirectFile = async (
    redirects: { fromPath: string; toPath: string }[],
    expectedPath: string,
    expectedContent: string
  ) => {
    await onPostBuild({
      store: {
        getState: () => ({
          redirects,
          program: {
            directory: "./"
          }
        })
      }
    });
    expect(readFileSync(expectedPath, "utf-8")).toStrictEqual(expectedContent);
  };

  beforeEach(() => {
    if (existsSync(tempFolderPath)) {
      rmSync(tempFolderPath, { recursive: true, force: true });
    }
  });

  // cleanup
  afterAll(() => {
    if (existsSync(tempFolderPath)) {
      rmSync(tempFolderPath, { recursive: true, force: true });
    }
  });

  it("does nothing if no redirects provided", async () => {
    await onPostBuild({
      store: {
        getState: () => ({
          redirects: [],
          program: {
            directory: "./"
          }
        })
      }
    });

    expect(existsSync(tempFolderPath)).toBeFalsy();
  });

  it("writes redirects from root", async () => {
    await assertRedirectFile(
      [
        {
          fromPath: "/",
          toPath: "/hello"
        }
      ],
      `${tempFolderPath}/index.html`,
      '<meta http-equiv="refresh" content="0; URL=\'/hello/\'" />'
    );
  });

  it("writes redirects to root", async () => {
    await assertRedirectFile(
      [
        {
          fromPath: "/hello",
          toPath: "/"
        }
      ],
      `${tempFolderPath}/hello/index.html`,
      '<meta http-equiv="refresh" content="0; URL=\'/\'" />'
    );
  });

  it("writes deep path redirects", async () => {
    await assertRedirectFile(
      [
        {
          fromPath: "/a/b/c/d",
          toPath: "/x/y/z"
        }
      ],
      `${tempFolderPath}/a/b/c/d/index.html`,
      '<meta http-equiv="refresh" content="0; URL=\'/x/y/z/\'" />'
    );
  });

  it("handles external redirects", async () => {
    await assertRedirectFile(
      [
        {
          fromPath: "/a/b",
          toPath: "http://example.com/"
        }
      ],
      `${tempFolderPath}/a/b/index.html`,
      '<meta http-equiv="refresh" content="0; URL=\'http://example.com/\'" />'
    );
  });

  it("handles the same from path twice", async () => {
    await assertRedirectFile(
      [
        {
          fromPath: "/",
          toPath: "/hello"
        },
        {
          fromPath: "/",
          toPath: "/world"
        }
      ],
      `${tempFolderPath}/index.html`,
      '<meta http-equiv="refresh" content="0; URL=\'/hello/\'" />'
    );
  });

  it("handles prefix paths", async () => {
    await onPostBuild({
      store: {
        getState: () => ({
          config: {
            pathPrefix: "prefix"
          },
          redirects: [
            {
              fromPath: "/prefix/",
              toPath: "/hello"
            }
          ],
          program: {
            directory: "./",
            prefixPaths: true
          }
        })
      }
    });

    expect(readFileSync(`${tempFolderPath}/index.html`, "utf-8")).toStrictEqual(
      '<meta http-equiv="refresh" content="0; URL=\'/hello/\'" />'
    );
  });
});
