/* eslint-disable no-console */
import path from "path";
import fs from "fs";
import mockConsole from "jest-mock-console";
import { mockResponses } from "@bmi-digital/fetch-mocks";
import fetchMockJest from "fetch-mock-jest";

const fetchMock = fetchMockJest.sandbox();

jest.mock("dotenv", () => ({ config: jest.fn() }));
jest.mock("node-fetch", () => fetchMock);

let answer: (answer: string) => void;
let onAsk: (askedQuestion: string) => void | undefined;
const expectQuestion = (question: string) =>
  new Promise<void>((resolve, reject) => {
    onAsk = (askedQuestion: string) => {
      if (askedQuestion !== question) {
        reject(`Expected ${question}, Found: ${askedQuestion}`);
      }
      resolve();
    };
  });
const question = jest.fn().mockImplementation((question, resolve) => {
  if (onAsk) {
    onAsk(question);
  }
  answer = resolve;
});

let onDone: (value?: unknown) => void;
let done: Promise<unknown>;
jest.mock("readline", () => {
  return {
    createInterface: () => {
      done = new Promise((resolve) => (onDone = resolve));
      return {
        question,
        close: () => {
          if (onDone) {
            onDone();
          }
        }
      };
    }
  };
});

const publish = jest.fn();
const createEntry = jest.fn().mockReturnValue({ publish });
const getEnvironment = jest.fn().mockReturnValue({ createEntry });
const getSpace = jest.fn().mockReturnValue({ getEnvironment });
const createClient = jest.fn().mockImplementation(() => ({ getSpace }));
jest.mock("contentful-management", () => {
  return {
    createClient
  };
});

beforeAll(() => {
  mockConsole();
});

const argv = process.argv;
const env = process.env;

const validEnv = {
  MANAGEMENT_ACCESS_TOKEN: "MANAGEMENT_ACCESS_TOKEN:value",
  SPACE_ID: "SPACE_ID:value",
  CONTENTFUL_ENVIRONMENT: "CONTENTFUL_ENVIRONMENT:value",
  LOCALE: "LOCALE:value"
};

const getMinimalPath = (file: string) => path.join("data", file);

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();

  process.argv = ["", "", getMinimalPath("merchants.tsv")];
  process.env = {
    ...env,
    ...validEnv
  };
});

afterEach(() => {
  process.argv = argv;
  process.env = env;
  fetchMock.reset();
});

describe("Merchants contentful upload", () => {
  // Make path relative to this dir to make the test output the same regardless of cwd
  jest.mock("fs", () => {
    return {
      readFile: (file: string, ...rest: any[]) => {
        const userCallback = rest.pop();

        const callback = (
          error: NodeJS.ErrnoException | null,
          data: string | Buffer
        ) => {
          if (error) {
            userCallback(new Error(`Couldn't read ${file}`));
            return;
          }
          userCallback(error, data);
        };

        // eslint-disable-next-line security/detect-non-literal-fs-filename
        return fs.readFile(path.join(__dirname, file), ...rest, callback);
      }
    };
  });

  it(`exits when answered with not "y"`, async () => {
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("no");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");
  });

  it(`continues when answered with "y"`, async () => {
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");

    expect(createClient.mock.calls).toMatchSnapshot("createClient");
    expect(getSpace.mock.calls).toMatchSnapshot("getSpace");
    expect(getEnvironment.mock.calls).toMatchSnapshot("getEnvironment");
    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it(`checks for first line to be empty`, async () => {
    process.argv = ["", "", getMinimalPath("first-line-non-empty.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");

    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it(`checks that header line matches the template`, async () => {
    process.argv = ["", "", getMinimalPath("incorrect-header-line.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");

    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it(`throws on missing env vars`, async () => {
    process.env = {
      ...env,
      ...validEnv,
      LOCALE: ""
    };
    require("../scripts/merchants");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");

    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it(`throws if the file path is missing`, async () => {
    process.argv = ["", "", ""];
    require("../scripts/merchants");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");

    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it(`handles if the file doesn't exist`, async () => {
    process.argv = ["", "", getMinimalPath("a-non-existent-file.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");

    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it(`logs error when creating entry fails`, async () => {
    createEntry.mockImplementationOnce(() => {
      throw new Error("Connection intrrupted");
    });
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");

    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it("geocodes address", async () => {
    mockResponses(fetchMock, {
      method: "GET",
      url: `begin:https://maps.googleapis.com`,
      body: {
        results: [{ geometry: { location: { lat: 1, lng: 2 } } }]
      }
    });

    process.argv = ["", "", getMinimalPath("empty-location.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;

    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it("geocoding doesn't return results", async () => {
    mockResponses(fetchMock, {
      method: "GET",
      url: `begin:https://maps.googleapis.com`,
      body: {
        results: [],
        error_message: "Test error message"
      }
    });

    process.argv = ["", "", getMinimalPath("empty-location.tsv")];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;

    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");
    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });
});
