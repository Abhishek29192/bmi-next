import { createSystemPages } from "../systemDetailsPages";

const siteId = "foo";
const countryCode = "en";
const createPage = jest.fn();
const graphql = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe("createSystemPages function", () => {
  it("should create the system details pages", async () => {
    graphql.mockResolvedValue({
      errors: null,
      data: { systems: { id: "bar" } }
    });

    await createSystemPages({
      siteId,
      countryCode,
      createPage,
      graphql
    });

    expect(graphql).toHaveBeenNthCalledWith(
      1,
      `
    {
      systems {
        id
      }
    }
  `
    );
    expect(graphql).toHaveBeenCalledTimes(1);

    expect(createPage).toHaveBeenNthCalledWith(1, {
      component: expect.any(String),
      context: {
        systemPageId: "bar",
        siteId
      },
      path: "/en/system-details-page/"
    });
    expect(createPage).toHaveBeenCalledTimes(1);
  });

  it("should catch any errors", async () => {
    graphql.mockResolvedValue({
      errors: "Something went wrong",
      data: null
    });

    await expect(
      createSystemPages({
        siteId,
        countryCode,
        createPage,
        graphql
      })
    ).rejects.toThrow("Something went wrong");

    expect(graphql).toHaveBeenNthCalledWith(
      1,
      `
    {
      systems {
        id
      }
    }
  `
    );
    expect(graphql).toHaveBeenCalledTimes(1);

    expect(createPage).toHaveBeenCalledTimes(0);
  });
});
