import { jest } from "@jest/globals";
import type { EnvironmentAlias } from "contentful-management";

export const createEnvironmentAliasWithEnvironmentId = (
  environmentId: string
): EnvironmentAlias => {
  const environmentAlias = createEnvironmentAlias();
  environmentAlias.environment.sys.id = environmentId;
  return environmentAlias;
};

const createEnvironmentAlias = (
  environmentAlias?: Partial<EnvironmentAlias>
): EnvironmentAlias => ({
  environment: {
    sys: {
      type: "Link",
      linkType: "Environment",
      id: "environment-id"
    }
  },
  sys: {
    id: "master-alias",
    type: "EnvironmentAlias",
    version: 1,
    createdAt: "",
    updatedAt: "",
    space: {
      sys: {
        id: "space-id",
        type: "Link",
        linkType: "Space"
      }
    }
  },
  delete: jest.fn<EnvironmentAlias["delete"]>(),
  update: jest.fn<EnvironmentAlias["update"]>(),
  toPlainObject: jest.fn<EnvironmentAlias["toPlainObject"]>(),
  ...environmentAlias
});

export default createEnvironmentAlias;
