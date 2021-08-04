/* eslint-disable no-console */
import path from "path";
import fs from "fs";
import mockConsole from "jest-mock-console";

jest.mock("dotenv", () => ({ config: jest.fn() }));

let answer;
let onAsk;
const expectQuestion = (question) =>
  new Promise<void>((resolve, reject) => {
    onAsk = (askedQuestion) => {
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

let onDone;
let done;
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

const createEntry = jest.fn();
const getEnvironment = jest.fn().mockReturnValue({ createEntry });
const getSpace = jest.fn().mockReturnValue({ getEnvironment });
let createClient;
jest.mock("contentful-management", () => {
  createClient = jest.fn().mockImplementation(() => ({ getSpace }));
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

const getMinimalPath = (file) => path.join("data/", file);

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
});

describe("Merchants contentful upload", () => {
  // Make path relative to this dir to make the test output the same regardless of cwd
  jest.mock("fs", () => {
    return {
      readFile: (file, ...rest) => {
        const userCallback = rest.pop();

        const callback = (error, data) => {
          if (error) {
            userCallback(new Error(`Couldn't read ${file}`));
            return;
          }
          userCallback(error, data);
        };

        //@ts-ignore
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
    process.argv = [
      "",
      "",
      getMinimalPath("first-line-non-empty/merchants.tsv")
    ];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");

    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it(`checks that header line matches the template`, async () => {
    process.argv = [
      "",
      "",
      getMinimalPath("incorrect-header-line/merchants.tsv")
    ];
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
    process.argv = [
      "",
      "",
      getMinimalPath("a-non-existent-file/merchants.tsv")
    ];
    require("../scripts/merchants");
    await expectQuestion("Continue (y/N)?");
    answer("y");
    await done;
    expect((console.log as jest.Mock).mock.calls).toMatchSnapshot("log");
    expect((console.error as jest.Mock).mock.calls).toMatchSnapshot("error");

    expect(createEntry.mock.calls).toMatchSnapshot("createEntry");
  });

  it(`checks that the file must be called "merchants"`, async () => {
    process.argv = ["", "", getMinimalPath("not-merchants.tsv")];
    require("../scripts/merchants");
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
});
