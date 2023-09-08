import { jest } from "@jest/globals";
import { createCollection } from "@bmi/functions-contentful-management-client/helpers";
import { cleanupOldEnvironments } from "../cleanup.js";
import { createEnvironmentAliasWithEnvironmentId } from "./helpers/EnvironmentAliasHelper.js";
import { createEnvironmentWithId } from "./helpers/EnvironmentHelper.js";
import type { Space } from "contentful-management";

const mockGetEnvironments = jest.fn<Space["getEnvironments"]>();
const mockGetEnvironmentAliases = jest.fn<Space["getEnvironmentAliases"]>();
const space = {
  getEnvironments: mockGetEnvironments,
  getEnvironmentAliases: mockGetEnvironmentAliases
} as unknown as Space;

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("cleanupOldEnvironments", () => {
  it("should delete alpha versions", async () => {
    const v10Env = createEnvironmentWithId("v1.0.0");
    const v1Alpha1Env = createEnvironmentWithId("v1.0.0-alpha.1");
    const v1Alpha2Env = createEnvironmentWithId("v1.0.0-alpha.2");
    const v11Env = createEnvironmentWithId("v1.1.0");
    mockGetEnvironments.mockResolvedValueOnce(
      createCollection({
        items: [v10Env, v1Alpha1Env, v1Alpha2Env, v11Env]
      })
    );
    mockGetEnvironmentAliases.mockResolvedValueOnce(
      createCollection({ items: [] })
    );

    await cleanupOldEnvironments(v11Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha1Env.delete).toHaveBeenCalled();
    expect(v1Alpha2Env.delete).toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
  });

  it("should delete major versions that are more than 2 versions old", async () => {
    const v10Env = createEnvironmentWithId("v1.0.0");
    const v11Env = createEnvironmentWithId("v1.1.0");
    const v12Env = createEnvironmentWithId("v1.2.0");
    const v13Env = createEnvironmentWithId("v1.3.0");
    mockGetEnvironments.mockResolvedValueOnce(
      createCollection({
        items: [v10Env, v11Env, v12Env, v13Env]
      })
    );
    mockGetEnvironmentAliases.mockResolvedValueOnce(
      createCollection({ items: [] })
    );

    await cleanupOldEnvironments(v13Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).toHaveBeenCalled();
    expect(v11Env.delete).toHaveBeenCalled();
    expect(v12Env.delete).not.toHaveBeenCalled();
    expect(v13Env.delete).not.toHaveBeenCalled();
  });

  it("should not delete non-versioned environments", async () => {
    const v10Env = createEnvironmentWithId("v1.0.0");
    const v1Alpha1Env = createEnvironmentWithId("v1.0.0-alpha.1");
    const v1Alpha2Env = createEnvironmentWithId("v1.0.0-alpha.2");
    const v11Env = createEnvironmentWithId("v1.1.0");
    const nonVersionedEnv = createEnvironmentWithId("non-versioned");
    mockGetEnvironments.mockResolvedValueOnce(
      createCollection({
        items: [v10Env, v1Alpha1Env, v1Alpha2Env, v11Env, nonVersionedEnv]
      })
    );
    mockGetEnvironmentAliases.mockResolvedValueOnce(
      createCollection({
        items: []
      })
    );

    await cleanupOldEnvironments(v11Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha1Env.delete).toHaveBeenCalled();
    expect(v1Alpha2Env.delete).toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
    expect(nonVersionedEnv.delete).not.toHaveBeenCalled();
  });

  it("should delete different formatted semantic versioned environments", async () => {
    const v10Env = createEnvironmentWithId("v1.0.0");
    const v1Alpha1Env = createEnvironmentWithId("v1.0.0-alpha.1");
    const v1SomethingExtra = createEnvironmentWithId("v1.0.0-something-extra");
    const v1SomethingElse = createEnvironmentWithId("v1.0-something-else");
    const v11Env = createEnvironmentWithId("v1.1.0");
    mockGetEnvironments.mockResolvedValueOnce(
      createCollection({
        items: [v10Env, v1Alpha1Env, v1SomethingExtra, v1SomethingElse, v11Env]
      })
    );
    mockGetEnvironmentAliases.mockResolvedValueOnce(
      createCollection({
        items: []
      })
    );

    await cleanupOldEnvironments(v11Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha1Env.delete).toHaveBeenCalled();
    expect(v1SomethingExtra.delete).toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
  });

  it("should not delete non-semantic versioned environments", async () => {
    const v10Env = createEnvironmentWithId("v1.0.0");
    const v1Alpha1Env = createEnvironmentWithId("v1.0.0-alpha.1");
    const v10NonSemantic = createEnvironmentWithId("v1.0");
    const v11Env = createEnvironmentWithId("v1.1.0");
    mockGetEnvironments.mockResolvedValueOnce(
      createCollection({
        items: [v10Env, v1Alpha1Env, v10NonSemantic, v11Env]
      })
    );
    mockGetEnvironmentAliases.mockResolvedValueOnce(
      createCollection({
        items: []
      })
    );

    await cleanupOldEnvironments(v11Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha1Env.delete).toHaveBeenCalled();
    expect(v10NonSemantic.delete).not.toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
  });

  it("should not delete aliased environments", async () => {
    const v10Env = createEnvironmentWithId("v1.0.0");
    const v1Alpha1Env = createEnvironmentWithId("v1.0.0-alpha.1");
    const v1Alpha2Env = createEnvironmentWithId("v1.0.0-alpha.2");
    const v11Env = createEnvironmentWithId("v1.1.0");
    mockGetEnvironments.mockResolvedValueOnce(
      createCollection({
        items: [v10Env, v1Alpha1Env, v1Alpha2Env, v11Env]
      })
    );
    mockGetEnvironmentAliases.mockResolvedValueOnce(
      createCollection({
        items: [
          createEnvironmentAliasWithEnvironmentId(v10Env.sys.id),
          createEnvironmentAliasWithEnvironmentId(v1Alpha1Env.sys.id),
          createEnvironmentAliasWithEnvironmentId(v1Alpha2Env.sys.id),
          createEnvironmentAliasWithEnvironmentId(v11Env.sys.id)
        ]
      })
    );

    await cleanupOldEnvironments(v11Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha1Env.delete).not.toHaveBeenCalled();
    expect(v1Alpha2Env.delete).not.toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
  });

  it("should not delete environment that matches tag", async () => {
    const v10Env = createEnvironmentWithId("v1.0.0");
    const v11Env = createEnvironmentWithId("v1.1.0");
    const v12Alpha1Env = createEnvironmentWithId("v1.2.0-alpha.1");
    const v12Alpha2Env = createEnvironmentWithId("v1.2.0-alpha.2");
    mockGetEnvironments.mockResolvedValueOnce(
      createCollection({
        items: [v10Env, v12Alpha1Env, v12Alpha2Env, v11Env]
      })
    );
    mockGetEnvironmentAliases.mockResolvedValueOnce(
      createCollection({
        items: []
      })
    );

    await cleanupOldEnvironments(v12Alpha2Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v10Env.delete).not.toHaveBeenCalled();
    expect(v12Alpha1Env.delete).toHaveBeenCalled();
    expect(v12Alpha2Env.delete).not.toHaveBeenCalled();
    expect(v11Env.delete).not.toHaveBeenCalled();
  });

  it("should handle only 0 old major version", async () => {
    const v13Aplha1Env = createEnvironmentWithId("v1.3.0-alpha.1");
    const v13Alpha2Env = createEnvironmentWithId("v1.3.0-alpha.2");
    const v13Env = createEnvironmentWithId("v1.3.0");
    mockGetEnvironments.mockResolvedValueOnce(
      createCollection({
        items: [v13Aplha1Env, v13Alpha2Env, v13Env]
      })
    );
    mockGetEnvironmentAliases.mockResolvedValueOnce(
      createCollection({
        items: []
      })
    );

    await cleanupOldEnvironments(v13Env.sys.id, space);

    expect(mockGetEnvironments).toHaveBeenCalled();
    expect(mockGetEnvironmentAliases).toHaveBeenCalled();
    expect(v13Aplha1Env.delete).toHaveBeenCalled();
    expect(v13Alpha2Env.delete).toHaveBeenCalled();
    expect(v13Env.delete).not.toHaveBeenCalled();
  });
});
