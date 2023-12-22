import { jest } from "@jest/globals";
import type { Space } from "contentful-management";

const createSpace = (space?: Partial<Space>): Space => ({
  sys: {
    type: "Space",
    id: "space-id",
    version: 1,
    createdAt: "",
    updatedAt: "",
    organization: {
      sys: {
        id: "organisation-id"
      }
    }
  },
  name: "Space",
  getEnvironment: jest.fn<Space["getEnvironment"]>(),
  delete: jest.fn<Space["delete"]>(),
  update: jest.fn<Space["update"]>(),
  getEnvironments: jest.fn<Space["getEnvironments"]>(),
  createEnvironment: jest.fn<Space["createEnvironment"]>(),
  createEnvironmentWithId: jest.fn<Space["createEnvironmentWithId"]>(),
  getWebhook: jest.fn<Space["getWebhook"]>(),
  getWebhooks: jest.fn<Space["getWebhooks"]>(),
  createWebhook: jest.fn<Space["createWebhook"]>(),
  createWebhookWithId: jest.fn<Space["createWebhookWithId"]>(),
  getRole: jest.fn<Space["getRole"]>(),
  getRoles: jest.fn<Space["getRoles"]>(),
  createRole: jest.fn<Space["createRole"]>(),
  createRoleWithId: jest.fn<Space["createRoleWithId"]>(),
  getSpaceUser: jest.fn<Space["getSpaceUser"]>(),
  getSpaceUsers: jest.fn<Space["getSpaceUsers"]>(),
  getTeams: jest.fn<Space["getTeams"]>(),
  getSpaceMember: jest.fn<Space["getSpaceMember"]>(),
  getSpaceMembers: jest.fn<Space["getSpaceMembers"]>(),
  getSpaceMembership: jest.fn<Space["getSpaceMembership"]>(),
  getSpaceMemberships: jest.fn<Space["getSpaceMemberships"]>(),
  createSpaceMembership: jest.fn<Space["createSpaceMembership"]>(),
  createSpaceMembershipWithId: jest.fn<Space["createSpaceMembershipWithId"]>(),
  getTeamSpaceMembership: jest.fn<Space["getTeamSpaceMembership"]>(),
  getTeamSpaceMemberships: jest.fn<Space["getTeamSpaceMemberships"]>(),
  createTeamSpaceMembership: jest.fn<Space["createTeamSpaceMembership"]>(),
  getApiKey: jest.fn<Space["getApiKey"]>(),
  getApiKeys: jest.fn<Space["getApiKeys"]>(),
  createApiKey: jest.fn<Space["createApiKey"]>(),
  createApiKeyWithId: jest.fn<Space["createApiKeyWithId"]>(),
  getPreviewApiKey: jest.fn<Space["getPreviewApiKey"]>(),
  getPreviewApiKeys: jest.fn<Space["getPreviewApiKeys"]>(),
  createEnvironmentAliasWithId:
    jest.fn<Space["createEnvironmentAliasWithId"]>(),
  getEnvironmentAlias: jest.fn<Space["getEnvironmentAlias"]>(),
  getEnvironmentAliases: jest.fn<Space["getEnvironmentAliases"]>(),
  getScheduledAction: jest.fn<Space["getScheduledAction"]>(),
  getScheduledActions: jest.fn<Space["getScheduledActions"]>(),
  createScheduledAction: jest.fn<Space["createScheduledAction"]>(),
  updateScheduledAction: jest.fn<Space["updateScheduledAction"]>(),
  deleteScheduledAction: jest.fn<Space["deleteScheduledAction"]>(),
  toPlainObject: jest.fn<Space["toPlainObject"]>(),
  getWebhookSigningSecret: jest.fn<Space["getWebhookSigningSecret"]>(),
  upsertWebhookSigningSecret: jest.fn<Space["upsertWebhookSigningSecret"]>(),
  deleteWebhookSigningSecret: jest.fn<Space["deleteWebhookSigningSecret"]>(),
  ...space
});

export default createSpace;
