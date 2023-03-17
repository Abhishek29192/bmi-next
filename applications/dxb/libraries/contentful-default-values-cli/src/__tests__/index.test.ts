import type { ClientAPI, Space } from "contentful-management";

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
const publishAll = jest.fn();
jest.mock("@bmi/cms-consolidation-utility", () => {
  return { fillDefaultValues, publishAll };
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

  it("Does not call publishAll if PUBLISH_ALL is not set", async () => {
    const originalPublishAll = process.env.PUBLISH_ALL;
    delete process.env.PUBLISH_ALL;

    const environment = {};
    getEnvironment.mockReturnValueOnce(environment);

    await main("market__uk", ["en-GB"]);

    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(publishAll).not.toBeCalled();

    process.env.PUBLISH_ALL = originalPublishAll;
  });

  it("Does not call publishAll if PUBLISH_ALL set to false", async () => {
    const originalPublishAll = process.env.PUBLISH_ALL;
    process.env.PUBLISH_ALL = "false";

    const environment = {};
    getEnvironment.mockReturnValueOnce(environment);

    await main("market__uk", ["en-GB"]);

    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(publishAll).not.toBeCalled();

    process.env.PUBLISH_ALL = originalPublishAll;
  });

  it("Calls publishAll if PUBLISH_ALL set to true", async () => {
    const originalPublishAll = process.env.PUBLISH_ALL;
    process.env.PUBLISH_ALL = "true";

    const environment = {};
    getEnvironment.mockReturnValueOnce(environment);

    await main("market__uk", ["en-GB"]);

    expect(getEnvironment).toHaveBeenCalledWith(
      process.env.CONTENTFUL_ENVIRONMENT
    );
    expect(publishAll).toBeCalledWith(environment, "market__uk");

    process.env.PUBLISH_ALL = originalPublishAll;
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
