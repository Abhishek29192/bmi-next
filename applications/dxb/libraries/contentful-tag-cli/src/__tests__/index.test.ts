import { ClientAPI, Space } from "contentful-management";

const main = async () => (await import("..")).main();

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

const tagAndUpdate = jest.fn();
const publishAll = jest.fn();
const createTag = jest.fn();
const sleep = jest.fn();
jest.mock("@bmi/contentful-tag-utility", () => {
  return { tagAndUpdate, publishAll, createTag, sleep };
});

describe("main", () => {
  it("Creates a client", async () => {
    await main();
  });

  it("Calls createTag", async () => {
    await main();

    expect(createTag).toBeCalled();
  });

  it("Calls tagAndUpdate", async () => {
    await main();

    expect(tagAndUpdate).toBeCalled();
  });

  it("Calls publishAll", async () => {
    await main();

    expect(publishAll).toBeCalled();
  });
});
