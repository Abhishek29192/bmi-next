import { getEnvironment } from "../getEnvironment";

const spaceGetEnvironment = jest.fn().mockReturnValue("environment");

jest.mock("contentful-management", () => {
  const originalModule = jest.requireActual("contentful-management");

  return {
    ...originalModule,
    createClient: jest.fn().mockImplementation(() => ({
      getSpace: jest.fn().mockImplementation(() => ({
        getEnvironment: spaceGetEnvironment
      }))
    }))
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("getEnvironment", () => {
  it("returns already existing client on environment call", async () => {
    await getEnvironment();
    expect(spaceGetEnvironment).toBeCalledTimes(1);

    spaceGetEnvironment.mockReset();
    await getEnvironment();
    expect(spaceGetEnvironment).toBeCalledTimes(0);
  });
});
