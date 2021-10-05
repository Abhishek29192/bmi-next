import { createSystemPages } from "../systemDetailsPages";
import { getPathWithCountryCode } from "../../schema/resolvers/utils/path";

const siteId = "foo";
const countryCode = "en";
const createPage = jest.fn();
const graphql = jest.fn();
const system1 = {
  id: "bar",
  path: "s/test",
  systemReferences: [
    { referenceType: "CROSSELLING", target: { code: "code2" } },
    { referenceType: "CROSSELLING", target: { code: "code3" } }
  ]
};
const system2 = {
  id: "bar2",
  path: "s/test2",
  systemReferences: [
    { referenceType: "CROSSELLING", target: { code: "code1" } },
    { referenceType: "CROSSELLING", target: { code: "code3" } }
  ]
};
const system3 = {
  id: "bar3",
  path: "s/test3",
  systemReferences: [
    { referenceType: "CROSSELLING", target: { code: "code1" } },
    { referenceType: "NON-CROSSELLING", target: { code: "code2" } }
  ]
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("createSystemPages function", () => {
  it("should create the system details pages accordingly", async () => {
    graphql.mockResolvedValue({
      errors: null,
      data: {
        allSystems: {
          nodes: [system1, system2]
        }
      }
    });

    await createSystemPages({
      siteId,
      countryCode,
      createPage,
      graphql
    });

    expect(graphql).toHaveBeenCalledWith(`
    {
      allSystems {
        nodes {
          id
          path
          systemReferences {
            referenceType
            target {
              code
            }
          }
        }
      }
    }
  `);
    expect(createPage).toHaveBeenNthCalledWith(1, {
      component: expect.any(String),
      context: {
        systemPageId: system1.id,
        siteId,
        relatedSystemCodes: ["code2", "code3"]
      },
      path: getPathWithCountryCode(countryCode, system1.path)
    });
    expect(createPage).toHaveBeenNthCalledWith(2, {
      component: expect.any(String),
      context: {
        systemPageId: system2.id,
        siteId,
        relatedSystemCodes: ["code1", "code3"]
      },
      path: getPathWithCountryCode(countryCode, system2.path)
    });
  });

  it("should filter out systemReferences only crosselling referenceType", async () => {
    graphql.mockResolvedValue({
      errors: null,
      data: {
        allSystems: {
          nodes: [system3]
        }
      }
    });

    await createSystemPages({
      siteId,
      countryCode,
      createPage,
      graphql
    });

    expect(graphql).toHaveBeenCalledWith(`
    {
      allSystems {
        nodes {
          id
          path
          systemReferences {
            referenceType
            target {
              code
            }
          }
        }
      }
    }
  `);
    expect(createPage).toHaveBeenNthCalledWith(1, {
      component: expect.any(String),
      context: {
        systemPageId: system3.id,
        siteId,
        relatedSystemCodes: ["code1"]
      },
      path: getPathWithCountryCode(countryCode, system3.path)
    });
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

    expect(graphql).toHaveBeenCalledWith(`
    {
      allSystems {
        nodes {
          id
          path
          systemReferences {
            referenceType
            target {
              code
            }
          }
        }
      }
    }
  `);
    expect(createPage).toHaveBeenCalledTimes(0);
  });
});
