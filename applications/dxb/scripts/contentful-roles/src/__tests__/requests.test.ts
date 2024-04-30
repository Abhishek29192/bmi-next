import { createRoles, getSpaceRoles, updateRole } from "../requests";
import { createRoleData, role as roleData } from "./__mocks__/roleMock";

jest.mock("@bmi/fetch-retry", () => ({
  __esModule: true,
  default: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const fetchRetryMock = jest.requireMock("@bmi/fetch-retry").default;

describe("createRoles", () => {
  it("should call fetchRetry with the required object input and log a success message", async () => {
    fetchRetryMock.mockResolvedValueOnce({ ok: true });

    const consoleSpy = jest.spyOn(console, "info");

    await createRoles(createRoleData);

    expect(fetchRetryMock).toHaveBeenCalledWith(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/roles`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json"
        },
        body: JSON.stringify(createRoleData)
      }
    );
    expect(consoleSpy).toHaveBeenCalledWith("Created role");
  });

  it("should log an error message when fetchRetry returns an error", async () => {
    const error = new Error("Some error");
    fetchRetryMock.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "error");

    await createRoles(createRoleData);
    expect(consoleSpy).toHaveBeenCalledWith(error.message);
  });
});

describe("updateRole", () => {
  it("should call fetchRetry with the required object input and log a success message", async () => {
    fetchRetryMock.mockResolvedValueOnce({ ok: true });

    const consoleSpy = jest.spyOn(console, "info");

    await updateRole(roleData);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Triggering update ${roleData.name} role`
    );
    expect(fetchRetryMock).toHaveBeenCalledWith(
      `https://api.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/roles/${roleData.sys.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_MANAGEMENT_TOKEN}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          "X-Contentful-Version": roleData.sys.version.toString()
        },
        body: JSON.stringify(roleData)
      }
    );
    expect(consoleSpy).toHaveBeenCalledWith(`Updated ${roleData.name} role`);
  });

  it("should log an error message when fetchRetry returns an error", async () => {
    const error = new Error("Some error");
    fetchRetryMock.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "error");

    await updateRole(roleData);
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
