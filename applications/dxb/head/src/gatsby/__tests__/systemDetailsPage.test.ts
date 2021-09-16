import { createSystemPages } from "../systemDetailsPages";

const siteId = "foo";
const countryCode = "en";
const relatedSystemCodes = ["code1", "code2"];
const createPage = jest.fn();
const graphql = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe("createSystemPages function", () => {
  it("should create the system details pages", async () => {
    graphql.mockResolvedValue({
      errors: null,
      data: {
        dataJson: {
          id: "bar",
          systemReferences: [
            { referenceType: "CROSSELLING", target: { code: "code1" } },
            { referenceType: "CROSSELLING", target: { code: "code2" } }
          ]
        }
      }
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
      dataJson {
        id
        systemReferences {
          referenceType
          target {
            code
          }
        }
      }
    }
  `
    );
    expect(graphql).toHaveBeenCalledTimes(1);

    expect(createPage).toHaveBeenNthCalledWith(1, {
      component: expect.any(String),
      context: {
        systemPageId: "bar",
        siteId,
        relatedSystemCodes
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
      dataJson {
        id
        systemReferences {
          referenceType
          target {
            code
          }
        }
      }
    }
  `
    );
    expect(graphql).toHaveBeenCalledTimes(1);

    expect(createPage).toHaveBeenCalledTimes(0);
  });
});
