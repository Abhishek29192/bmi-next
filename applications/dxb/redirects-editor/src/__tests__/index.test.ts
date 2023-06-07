import fs from "fs";
import * as os from "os";
import * as path from "path";
import toml from "@iarna/toml";
import { Redirect } from "@bmi/head/src/utils/get-redirects";
import { main } from "../index";

const mockParseArgs = jest.fn();
jest.mock("util", () => ({
  parseArgs: () => mockParseArgs()
}));

type Arguments = {
  redirectsFile?: string;
  csvFile?: string;
  from?: string;
  to?: string;
  status?: string;
  removeHost?: boolean;
};

const createParseArgs = (parseArgs?: Arguments): { values: Arguments } => {
  return {
    values: {
      redirectsFile: `${__dirname}/resources/empty-redirects.toml`,
      from: "/new-from",
      to: "/new-to",
      status: "301",
      removeHost: false,
      ...parseArgs
    }
  };
};

const createTomlFile = (redirects?: Redirect[]): string => {
  const file = fs.mkdtempSync(os.tmpdir());
  const redirectsFilePath = `${file}/redirects.toml`;
  const tomlContents = redirects ? toml.stringify({ redirects }) : "";
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFileSync(redirectsFilePath, tomlContents);
  return redirectsFilePath;
};

function deleteRedirectsFile(redirectsFile: string) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.rmSync(path.dirname(redirectsFile), { recursive: true, force: true });
}

describe("main", () => {
  it("should throw error if no arguments are provided", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({
        redirectsFile: undefined,
        from: undefined,
        to: undefined,
        status: undefined,
        csvFile: undefined
      })
    );

    await expect(main()).rejects.toThrow(
      "Please pass in the path to the redirects file."
    );
  });

  it("should throw error if csvFile, to and from are not passed in", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({ csvFile: undefined, from: undefined, to: undefined })
    );

    await expect(main()).rejects.toThrow(
      "Please provide a 'from' and a 'to' for the redirect."
    );
  });

  it("should throw error if csvFile and to are not passed in, but from is", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({
        csvFile: undefined,
        to: undefined
      })
    );

    await expect(main()).rejects.toThrow(
      "Please provide a 'from' and a 'to' for the redirect."
    );
  });

  it("should throw error if csvFile and from are not passed in, but to is", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({
        csvFile: undefined,
        to: undefined
      })
    );

    await expect(main()).rejects.toThrow(
      "Please provide a 'from' and a 'to' for the redirect."
    );
  });

  it("should throw error if csvFile provided but does not exist", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({
        csvFile: "/path/to/non-existent/file.csv"
      })
    );

    await expect(main()).rejects.toThrow(
      "File does not exist. Check to make sure the file path to your csv is correct."
    );
  });

  it("should throw error if csvFile provided does not contain any redirects", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({
        csvFile: `${__dirname}/resources/empty-redirects.csv`
      })
    );

    await expect(main()).rejects.toThrow(
      "Please provide a CSV file with both the 'from' and 'to' values for all redirects."
    );
  });

  it("should throw error if csvFile provided contains multiple redirects but with one missing from", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({
        csvFile: `${__dirname}/resources/missing-from-redirects.csv`
      })
    );

    await expect(main()).rejects.toThrow(
      "Please provide a CSV file with both the 'from' and 'to' values for all redirects."
    );
  });

  it("should throw error if csvFile provided contains multiple redirects but with one missing to", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({
        csvFile: `${__dirname}/resources/missing-to-redirects.csv`
      })
    );

    await expect(main()).rejects.toThrow(
      "Please provide a CSV file with both the 'from' and 'to' values for all redirects."
    );
  });

  it("should throw error if redirects file does not exist", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({
        redirectsFile: "/path/to/non-existent/file.toml"
      })
    );

    await expect(main()).rejects.toThrow(
      "ENOENT: no such file or directory, open '/path/to/non-existent/file.toml'"
    );
  });

  it("should throw error if redirects file is not a valid TOML file", async () => {
    mockParseArgs.mockReturnValueOnce(
      createParseArgs({
        redirectsFile: `${__dirname}/resources/invalid-file.json`
      })
    );

    await expect(main()).rejects.toThrow(
      `Unknown character "123" at row 1, col 2, pos 1:
1> {
    ^
2:   "redirects": [

`
    );
  });

  it("should produce TOML file with just the provided redirect if initial TOML file is empty", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile(),
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = ${args.values.status}
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with existing and new redirect if initial TOML file has redirects", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with existing duplicated entries removed", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-to",
          status: 301
        },
        {
          from: "/existing-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with existing duplicated entries updated if new redirect has same from", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/new-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = ${args.values.status}
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with existing entries updated to if new redirect has same from as existing to", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/new-from",
          status: 301
        }
      ]),
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "${args.values.to}"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with all entries ordered by from in reverse", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/z-from",
          to: "/a-to",
          status: 301
        },
        {
          from: "/a-from",
          to: "/a-to",
          status: 301
        }
      ]),
      from: "/b-from",
      to: "/a-to",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/z-from"
to = "/a-to"
status = 301

[[redirects]]
from = "/b-from"
to = "/a-to"
status = 301

[[redirects]]
from = "/a-from"
to = "/a-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with from URLs URI encoded", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-ø-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "/new-ø-from",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/new-%C3%B8-from"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-%C3%B8-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with to URLs URI encoded", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-ø-to",
          status: 301
        }
      ]),
      to: "/new-ø-to",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "/new-%C3%B8-to"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "/existing-%C3%B8-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with from URLs URI encoded once, even though were double encoded before", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-%25C3%25B8-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "/new-%25C3%25B8-from",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/new-%C3%B8-from"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-%C3%B8-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with to URLs URI encoded once, even though were double encoded before", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-%25C3%25B8-to",
          status: 301
        }
      ]),
      to: "/new-%25C3%25B8-to",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "/new-%C3%B8-to"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "/existing-%C3%B8-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with URLs deduplicated with accented characters", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-%C3%B8-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "/existing-ø-from",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/existing-%C3%B8-from"
to = "${args.values.to}"
status = ${args.values.status}
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with / added to the beginning of from URLs if not https:// or /", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "existing-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "new-from",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/new-from"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should not produce TOML file with / added to the beginning of from URLs if https://", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "https://existing-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "https://new-from",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "https://existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with / added to the beginning of to URLs if not https:// or /", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "existing-to",
          status: 301
        }
      ]),
      to: "new-to",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "/new-to"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should not produce TOML file with / added to the beginning of to URLs if https://", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "https://existing-to",
          status: 301
        }
      ]),
      to: "https://new-to",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "https://existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with / removed from the end of from URLs", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from/",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "/new-from/",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/new-from"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with / removed from the end of to URLs", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-to/",
          status: 301
        }
      ]),
      to: "/new-to/",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "/new-to"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with / if from is just /", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile(),
      from: "/",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/"
to = "${args.values.to}"
status = ${args.values.status}
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with query params still intact in from URL", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from?query=1",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "/new-from?query=2",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-from?query=1"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with query params still intact in to URL", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-to?query=1",
          status: 301
        }
      ]),
      to: "/new-to?query=2",
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = ${args.values.status}

[[redirects]]
from = "/existing-from"
to = "/existing-to?query=1"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with host removed from from URL if removeHost flag is set to true", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "https://www.bmigroup.com/existing-from?query=1",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "https://www.bmigroup.com/new-from?query=2",
      removeHost: true,
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/new-from?query=2"
to = "${args.values.to}"
status = 301

[[redirects]]
from = "/existing-from?query=1"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with host removed from to URL if removeHost flag is set to true", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "https://www.bmigroup.com/existing-to?query=1",
          status: 301
        }
      ]),
      to: "https://www.bmigroup.com/new-to?query=2",
      removeHost: true,
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "/new-to?query=2"
status = 301

[[redirects]]
from = "/existing-from"
to = "/existing-to?query=1"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with nothing changed to URL if removeHost flag is set to true and no host in URL", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from?query=1",
          to: "/existing-to",
          status: 301
        }
      ]),
      removeHost: true,
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = 301

[[redirects]]
from = "/existing-from?query=1"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with host still intact in to URL if removeHost flag is not set", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "https://www.bmigroup.com/existing-to?query=1",
          status: 301
        }
      ]),
      to: "https://www.bmigroup.com/new-to?query=2",
      removeHost: undefined,
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/new-from"
to = "${args.values.to}"
status = 301

[[redirects]]
from = "/existing-from"
to = "https://www.bmigroup.com/existing-to?query=1"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with host still intact in from URL if removeHost flag is set to false", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "https://www.bmigroup.com/existing-from?query=1",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "https://www.bmigroup.com/new-from?query=2",
      removeHost: false,
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = 301

[[redirects]]
from = "https://www.bmigroup.com/existing-from?query=1"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with host still intact in to URL if removeHost flag is set to false", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "https://www.bmigroup.com/existing-to?query=1",
          status: 301
        }
      ]),
      to: "https://www.bmigroup.com/new-to?query=2",
      removeHost: false,
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = 301

[[redirects]]
from = "/existing-from"
to = "https://www.bmigroup.com/existing-to?query=1"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with status defaulted to 301 for new redirects if not provided", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-to/",
          status: 301
        }
      ]),
      status: undefined,
      csvFile: undefined
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "${args.values.from}"
to = "${args.values.to}"
status = 301

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with all entries added from CSV file", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: undefined,
      to: undefined,
      status: undefined,
      csvFile: `${__dirname}/resources/redirects.csv`
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/new-from"
to = "/new-to"
status = 301

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with CSV redirects if csvFile, from and to are provided", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      from: "/arg-from",
      to: "/arg-to",
      status: "301",
      csvFile: `${__dirname}/resources/redirects.csv`
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/new-from"
to = "/new-to"
status = 301

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });

  it("should produce TOML file with status defaulted to 301 if not provided by CSV redirect", async () => {
    const args = createParseArgs({
      redirectsFile: createTomlFile([
        {
          from: "/existing-from",
          to: "/existing-to",
          status: 301
        }
      ]),
      csvFile: `${__dirname}/resources/missing-status-redirects.csv`
    });
    mockParseArgs.mockReturnValueOnce(args);

    await main();

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = fs
      .readFileSync(args.values.redirectsFile!)
      .toString("utf-8");
    expect(contents).toEqual(
      `[[redirects]]
from = "/new-from"
to = "/new-to"
status = 301

[[redirects]]
from = "/existing-from"
to = "/existing-to"
status = 301
`
    );

    deleteRedirectsFile(args.values.redirectsFile!);
  });
});
