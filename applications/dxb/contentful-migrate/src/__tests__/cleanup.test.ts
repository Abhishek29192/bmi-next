import { Space } from "contentful-management";
import { cleanupOldEnvironments } from "../cleanup";

const mockGetEnvironments = jest.fn();
const mockGetEnvironmentAliases = jest.fn();
const space = {
  getEnvironments: mockGetEnvironments,
  getEnvironmentAliases: mockGetEnvironmentAliases
} as unknown as Space;

describe("cleanupOldEnvironments", () => {
  it("should delete alpha versions", async () => {
    const v10Env = { sys: { id: "v1.0.0" }, delete: jest.fn() };
    const v1Alpha1Env = { sys: { id: "v1.0.0-alpha.1" }, delete: jest.fn() };
    const v1Alpha2Env = { sys: { id: "v1.0.0-alpha.2" }, delete: jest.fn() };
    const v11Env = { sys: { id: "v1.1.0" }, delete: jest.fn() };
    mockGetEnvironments.mockResolvedValueOnce({
      items: [v10Env, v1Alpha1Env, v1Alpha2Env, v11Env]
    });
    mockGetEnvironmentAliases.mockResolvedValueOnce({
      items: []
    });

    await cleanupOldEnvironments(v11Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha1Env.delete).toHaveBeenCalled();
    expect(v1Alpha2Env.delete).toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
  });

  it("should delete major versions that are more than 2 versions old", async () => {
    const v10Env = { sys: { id: "v1.0.0" }, delete: jest.fn() };
    const v11Env = { sys: { id: "v1.1.0" }, delete: jest.fn() };
    const v12Env = { sys: { id: "v1.2.0" }, delete: jest.fn() };
    const v13Env = { sys: { id: "v1.3.0" }, delete: jest.fn() };
    mockGetEnvironments.mockResolvedValueOnce({
      items: [v10Env, v11Env, v12Env, v13Env]
    });
    mockGetEnvironmentAliases.mockResolvedValueOnce({
      items: []
    });

    await cleanupOldEnvironments(v13Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).toHaveBeenCalled();
    expect(v11Env.delete).toHaveBeenCalled();
    expect(v12Env.delete).not.toHaveBeenCalled();
    expect(v13Env.delete).not.toHaveBeenCalled();
  });

  it("should not delete non-versioned environments", async () => {
    const v10Env = { sys: { id: "v1.0.0" }, delete: jest.fn() };
    const v1Alpha1Env = { sys: { id: "v1.0.0-alpha.1" }, delete: jest.fn() };
    const v1Alpha2Env = { sys: { id: "v1.0.0-alpha.2" }, delete: jest.fn() };
    const v11Env = { sys: { id: "v1.1.0" }, delete: jest.fn() };
    const nonVersionedEnv = { sys: { id: "non-versioned" }, delete: jest.fn() };
    mockGetEnvironments.mockResolvedValueOnce({
      items: [v10Env, v1Alpha1Env, v1Alpha2Env, v11Env, nonVersionedEnv]
    });
    mockGetEnvironmentAliases.mockResolvedValueOnce({
      items: []
    });

    await cleanupOldEnvironments(v11Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha1Env.delete).toHaveBeenCalled();
    expect(v1Alpha2Env.delete).toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
    expect(nonVersionedEnv.delete).not.toHaveBeenCalled();
  });

  it("should not delete aliased environments", async () => {
    const v10Env = { sys: { id: "v1.0.0" }, delete: jest.fn() };
    const v1Alpha1Env = { sys: { id: "v1.0.0-alpha.1" }, delete: jest.fn() };
    const v1Alpha2Env = { sys: { id: "v1.0.0-alpha.2" }, delete: jest.fn() };
    const v11Env = { sys: { id: "v1.1.0" }, delete: jest.fn() };
    mockGetEnvironments.mockResolvedValueOnce({
      items: [v10Env, v1Alpha1Env, v1Alpha2Env, v11Env]
    });
    mockGetEnvironmentAliases.mockResolvedValueOnce({
      items: [
        { environment: { sys: { id: v10Env.sys.id } } },
        { environment: { sys: { id: v1Alpha1Env.sys.id } } },
        { environment: { sys: { id: v1Alpha2Env.sys.id } } },
        { environment: { sys: { id: v11Env.sys.id } } }
      ]
    });

    await cleanupOldEnvironments(v11Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha1Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha2Env.delete).not.toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
  });

  it("should not delete environment that matches tag", async () => {
    const v10Env = { sys: { id: "v1.0.0" }, delete: jest.fn() };
    const v11Env = { sys: { id: "v1.1.0" }, delete: jest.fn() };
    const v12Alpha1Env = { sys: { id: "v1.2.0-alpha.1" }, delete: jest.fn() };
    const v12Alpha2Env = { sys: { id: "v1.2.0-alpha.2" }, delete: jest.fn() };
    mockGetEnvironments.mockResolvedValueOnce({
      items: [v10Env, v12Alpha1Env, v12Alpha2Env, v11Env]
    });
    mockGetEnvironmentAliases.mockResolvedValueOnce({
      items: []
    });

    await cleanupOldEnvironments(v12Alpha2Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v12Alpha1Env.delete).toHaveBeenCalled();
    expect(v12Alpha2Env.delete).not.toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
  });
});
