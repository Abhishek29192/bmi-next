import { createRoles, getSpaceRoles, updateRole } from "../requests";

jest.mock("@bmi/fetch-retry", () => ({
  __esModule: true,
  default: jest.fn()
}));

const body = {
  name: `DXB - Germay content publisher`,
  description: null,
  policies: [
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Entry"
            ]
          }
        ]
      },
      actions: ["read"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Entry"
            ]
          }
        ]
      },
      actions: ["update"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Entry"
            ]
          },
          {
            in: [
              {
                doc: "metadata.tags.sys.id"
              },
              [`market__Germany`]
            ]
          }
        ]
      },
      actions: ["delete"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Entry"
            ]
          }
        ]
      },
      actions: ["create"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Entry"
            ]
          },
          {
            in: [
              {
                doc: "metadata.tags.sys.id"
              },
              [`market__Germany`]
            ]
          }
        ]
      },
      actions: ["archive", "unarchive"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Entry"
            ]
          }
        ]
      },
      actions: ["publish", "unpublish"]
    },
    {
      effect: "deny",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Entry"
            ]
          },
          {
            in: [
              {
                doc: "metadata.tags.sys.id"
              },
              { otherMarketsTags: [] }
            ]
          }
        ]
      },
      actions: ["read"]
    },
    {
      effect: "deny",
      constraint: {
        and: [
          { equals: [{ doc: "sys.type" }, "Entry"] },
          {
            equals: [{ doc: "sys.contentType.sys.id" }, "calculatorRoofShape"]
          }
        ]
      },
      actions: ["update"]
    },
    {
      effect: "deny",
      constraint: {
        and: [
          { equals: [{ doc: "sys.type" }, "Entry"] },
          {
            equals: [{ doc: "sys.contentType.sys.id" }, "calculatorRoofShape"]
          }
        ]
      },
      actions: ["delete"]
    },
    {
      effect: "deny",
      constraint: {
        and: [
          { equals: [{ doc: "sys.type" }, "Entry"] },
          {
            equals: [{ doc: "sys.contentType.sys.id" }, "calculatorRoofShape"]
          }
        ]
      },
      actions: ["publish", "unpublish"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Asset"
            ]
          }
        ]
      },
      actions: ["read"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Asset"
            ]
          }
        ]
      },
      actions: ["update"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Asset"
            ]
          },
          {
            in: [
              {
                doc: "metadata.tags.sys.id"
              },
              [`market__Germany`]
            ]
          }
        ]
      },
      actions: ["delete"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Asset"
            ]
          }
        ]
      },
      actions: ["create"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Asset"
            ]
          },
          {
            in: [
              {
                doc: "metadata.tags.sys.id"
              },
              [`market__Germany`]
            ]
          }
        ]
      },
      actions: ["archive", "unarchive"]
    },
    {
      effect: "allow",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Asset"
            ]
          },
          {
            in: [
              {
                doc: "metadata.tags.sys.id"
              },
              [`market__Germany`]
            ]
          }
        ]
      },
      actions: ["publish", "unpublish"]
    },
    {
      effect: "deny",
      constraint: {
        and: [
          {
            equals: [
              {
                doc: "sys.type"
              },
              "Asset"
            ]
          },
          {
            in: [
              {
                doc: "metadata.tags.sys.id"
              },
              { otherMarketsTags: [] }
            ]
          }
        ]
      },
      actions: ["read"]
    }
  ],
  permissions: {
    ContentModel: ["read"],
    Settings: [],
    ContentDelivery: [],
    Environments: [],
    EnvironmentAliases: [],
    Tags: []
  }
};
beforeEach(() => {
  jest.clearAllMocks();
});

const fetchRetryMock = jest.requireMock("@bmi/fetch-retry").default;

describe("createRoles", () => {
  it("should call fetchRetry with the required object input and log a success message", async () => {
    fetchRetryMock.mockResolvedValueOnce({ ok: true });

    const consoleSpy = jest.spyOn(console, "info");

    await createRoles(body);

    expect(fetchRetryMock).toHaveBeenCalledWith(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/roles`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json"
        },
        body: JSON.stringify(body)
      }
    );
    expect(consoleSpy).toHaveBeenCalledWith("Created role");
  });

  it("should log an error message when fetchRetry returns an error", async () => {
    const error = new Error("Some error");
    fetchRetryMock.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "error");

    await createRoles(body);
    expect(consoleSpy).toHaveBeenCalledWith(error.message);
  });
});

describe("updateRole", () => {
  it("should call fetchRetry with the required object input and log a success message", async () => {
    const role = { name: "publisher", sys: { id: 1, version: 1 } };
    const body = {};
    fetchRetryMock.mockResolvedValueOnce({ ok: true });

    const consoleSpy = jest.spyOn(console, "info");

    await updateRole(body, role);

    expect(consoleSpy).toHaveBeenCalledWith(`Triggering update publisher role`);
    expect(fetchRetryMock).toHaveBeenCalledWith(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/roles/${role.sys.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          "X-Contentful-Version": role.sys.version
        },
        body: JSON.stringify(body)
      }
    );
    expect(consoleSpy).toHaveBeenCalledWith("Updated publisher role");
  });

  it("should log an error message when fetchRetry returns an error", async () => {
    const role = { name: "publisher", sys: { id: 1, version: 1 } };
    const body = {};
    const error = new Error("Some error");
    fetchRetryMock.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "error");

    await updateRole(body, role);
    expect(consoleSpy).toHaveBeenCalledWith(error.message);
  });
});

describe("getSpaceRoles", () => {
  it("should call fetchRetry with the required object input and return the reponse json object", async () => {
    fetchRetryMock.mockResolvedValueOnce({ ok: true });

    await getSpaceRoles();

    expect(fetchRetryMock).toHaveBeenCalledWith(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/roles`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json"
        }
      }
    );
  });

  it("should log an error message when fetchRetry returns an error", async () => {
    const error = new Error("Some error");
    fetchRetryMock.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "error");

    await getSpaceRoles();
    expect(consoleSpy).toHaveBeenCalledWith(error.message);
  });
});
