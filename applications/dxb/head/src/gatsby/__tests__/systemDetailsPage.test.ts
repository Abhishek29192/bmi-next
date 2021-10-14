import mockConsole from "jest-mock-console";
import { createSystemPages } from "../systemDetailsPages";
import { getPathWithCountryCode } from "../../schema/resolvers/utils/path";

const siteId = "foo";
const countryCode = "en";
const createPage = jest.fn();
const graphql = jest.fn();
const system1 = {
  id: "bar",
  path: "s/test",
  approvalStatus: "approved",
  systemReferences: [
    { referenceType: "CROSSELLING", target: { code: "code2" } },
    { referenceType: "CROSSELLING", target: { code: "code3" } }
  ]
};
const system2 = {
  id: "bar2",
  path: "s/test2",
  approvalStatus: "approved",
  systemReferences: [
    { referenceType: "CROSSELLING", target: { code: "code1" } },
    { referenceType: "CROSSELLING", target: { code: "code3" } }
  ]
};
const system3 = {
  id: "bar3",
  path: "s/test3",
  approvalStatus: "approved",
  systemReferences: [
    { referenceType: "CROSSELLING", target: { code: "code1" } },
    { referenceType: "NON-CROSSELLING", target: { code: "code2" } }
  ]
};

const systemUnApproved = {
  id: "bar4",
  path: "s/test4",
  approvalStatus: "unApproved",
  systemReferences: [
    { referenceType: "CROSSELLING", target: { code: "code1" } },
    { referenceType: "NON-CROSSELLING", target: { code: "code2" } }
  ]
};

const systemCheck = {
  id: "bar5",
  path: "s/test5",
  approvalStatus: "check",
  systemReferences: [
    { referenceType: "CROSSELLING", target: { code: "code1" } },
    { referenceType: "NON-CROSSELLING", target: { code: "code2" } }
  ]
};

beforeEach(() => {
  mockConsole();
  jest.resetAllMocks();
});

describe("createSystemPages function", () => {
  it("should create the system details pages for 'approved' systems only", async () => {
    graphql.mockResolvedValue({
      errors: null,
      data: {
        allSystems: {
          nodes: [system1, system2, systemUnApproved, systemCheck]
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
          approvalStatus
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

    expect(createPage).not.toHaveBeenCalledWith({
      component: expect.any(String),
      context: {
        systemPageId: systemUnApproved.id,
        siteId,
        relatedSystemCodes: ["code1", "code2"]
      },
      path: getPathWithCountryCode(countryCode, systemUnApproved.path)
    });

    expect(createPage).not.toHaveBeenCalledWith({
      component: expect.any(String),
      context: {
        systemPageId: systemCheck.id,
        siteId,
        relatedSystemCodes: ["code1", "code2"]
      },
      path: getPathWithCountryCode(countryCode, systemCheck.path)
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
          approvalStatus
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
          approvalStatus
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
