// import { main } from "../index";
import { Space, ClientAPI } from "contentful-management";

const main = async () => (await import("../index")).main();

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

const TagAndUpdate = jest.fn();
const PublishAll = jest.fn();
jest.mock("../coordinate", () => {
  return { TagAndUpdate, PublishAll };
});

const CreateTag = jest.fn();
jest.mock("../Tag", () => {
  return { CreateTag };
});

describe("main", () => {
  it("Creates a client", async () => {
    await main();
  });

  it("Calls CreateTag", async () => {
    await main();

    expect(CreateTag).toBeCalled();
  });

  it("Calls TagAndUpdate", async () => {
    await main();

    expect(TagAndUpdate).toBeCalled();
  });

  it("Calls PublishAll", async () => {
    await main();

    expect(PublishAll).toBeCalled();
  });
});
