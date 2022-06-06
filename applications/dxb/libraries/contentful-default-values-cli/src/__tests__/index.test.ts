import { ClientAPI, Space } from "contentful-management";
import mockConsole from "jest-mock-console";

const main = async (tag: string, locales: string[]) =>
  (await import("../index")).main(tag, ...locales);

const getEnvironment = jest.fn();
const mockSpace = (): Partial<Space> => {
  const space: Partial<Space> = {};
  space.getEnvironment = getEnvironment;
  return space;
};

const mockClient = (): Partial<ClientAPI> => {
  const client: Partial<ClientAPI> = {};
  client.getSpace = jest.fn().mockReturnValue(mockSpace());
  return client;
};

const createClient = jest.fn().mockReturnValue(mockClient());

jest.mock("contentful-management", () => {
  return {
    createClient
  };
});

const fillDefaultValues = jest.fn();
jest.mock("@bmi/contentful-tag-utility", () => {
  return { fillDefaultValues };
});

beforeEach(() => {
  mockConsole();
});

describe("main", () => {
  it("Creates a client", async () => {
    await main("market__uk", ["en-GB"]);
    expect(createClient).toBeCalled();
  });

  it("Calls fillDefaultValues", async () => {
    await main("market__uk", ["en-GB"]);

    expect(fillDefaultValues).toBeCalled();
  });

  it("Logs an error if market locales are not passed in", async () => {
    await main("market__uk", []);
    expect(console.error).toBeCalled();
  });

  it("Logs an error if market tag is not passed in", async () => {
    await main("", ["en-GB"]);
    expect(console.error).toBeCalled();
  });
});
