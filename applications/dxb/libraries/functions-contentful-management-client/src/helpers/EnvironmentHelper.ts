import { jest } from "@jest/globals";
import type { Environment } from "contentful-management";

const createEnvironment = (
  environment?: Partial<Environment>
): Environment => ({
  sys: {
    id: "master",
    type: "Environment",
    version: 1,
    createdAt: "",
    updatedAt: "",
    status: {
      sys: {
        id: "status-id",
        type: "Link",
        linkType: "Status"
      }
    },
    space: {
      sys: {
        id: "space-id",
        type: "Link",
        linkType: "Space",
        ...environment?.sys?.space?.sys
      }
    }
  },
  name: "master",
  delete: jest.fn<Environment["delete"]>(),
  update: jest.fn<Environment["update"]>(),
  getEntryFromData: jest.fn<Environment["getEntryFromData"]>(),
  getAssetFromData: jest.fn<Environment["getAssetFromData"]>(),
  getBulkAction: jest.fn<
    Environment["getBulkAction"]
  >() as Environment["getBulkAction"],
  createPublishBulkAction: jest.fn<Environment["createPublishBulkAction"]>(),
  createValidateBulkAction: jest.fn<Environment["createValidateBulkAction"]>(),
  createUnpublishBulkAction:
    jest.fn<Environment["createUnpublishBulkAction"]>(),
  getContentType: jest.fn<Environment["getContentType"]>(),
  getContentTypes: jest.fn<Environment["getContentTypes"]>(),
  createContentType: jest.fn<Environment["createContentType"]>(),
  createContentTypeWithId: jest.fn<Environment["createContentTypeWithId"]>(),
  getEditorInterfaceForContentType:
    jest.fn<Environment["getEditorInterfaceForContentType"]>(),
  getEditorInterfaces: jest.fn<Environment["getEditorInterfaces"]>(),
  getEntry: jest.fn<Environment["getEntry"]>(),
  deleteEntry: jest.fn<Environment["deleteEntry"]>(),
  getEntries: jest.fn<Environment["getEntries"]>(),
  getPublishedEntries: jest.fn<Environment["getPublishedEntries"]>(),
  createEntry: jest.fn<Environment["createEntry"]>(),
  createEntryWithId: jest.fn<Environment["createEntryWithId"]>(),
  getEntryReferences: jest.fn<Environment["getEntryReferences"]>(),
  getAssets: jest.fn<Environment["getAssets"]>(),
  getAsset: jest.fn<Environment["getAsset"]>(),
  createAsset: jest.fn<Environment["createAsset"]>(),
  createAssetWithId: jest.fn<Environment["createAssetWithId"]>(),
  createAssetFromFiles: jest.fn<Environment["createAssetFromFiles"]>(),
  createAssetKey: jest.fn<Environment["createAssetKey"]>(),
  getUpload: jest.fn<Environment["getUpload"]>(),
  createUpload: jest.fn<Environment["createUpload"]>(),
  getLocale: jest.fn<Environment["getLocale"]>(),
  getLocales: jest.fn<Environment["getLocales"]>(),
  createLocale: jest.fn<Environment["createLocale"]>(),
  getUiExtension: jest.fn<Environment["getUiExtension"]>(),
  getUiExtensions: jest.fn<Environment["getUiExtensions"]>(),
  createUiExtension: jest.fn<Environment["createUiExtension"]>(),
  createUiExtensionWithId: jest.fn<Environment["createUiExtensionWithId"]>(),
  createAppInstallation: jest.fn<Environment["createAppInstallation"]>(),
  createAppActionCall: jest.fn<Environment["createAppActionCall"]>(),
  createAppSignedRequest: jest.fn<Environment["createAppSignedRequest"]>(),
  getAppInstallation: jest.fn<Environment["getAppInstallation"]>(),
  getAppInstallations: jest.fn<Environment["getAppInstallations"]>(),
  getEntrySnapshots: jest.fn<Environment["getEntrySnapshots"]>(),
  getContentTypeSnapshots: jest.fn<Environment["getContentTypeSnapshots"]>(),
  createTag: jest.fn<Environment["createTag"]>(),
  getTag: jest.fn<Environment["getTag"]>(),
  getTags: jest.fn<Environment["getTags"]>(),
  getRelease: jest.fn<Environment["getRelease"]>(),
  getReleases: jest.fn<Environment["getReleases"]>(),
  createRelease: jest.fn<Environment["createRelease"]>(),
  updateRelease: jest.fn<Environment["updateRelease"]>(),
  deleteRelease: jest.fn<Environment["deleteRelease"]>(),
  publishRelease: jest.fn<Environment["publishRelease"]>(),
  unpublishRelease: jest.fn<Environment["unpublishRelease"]>(),
  validateRelease: jest.fn<Environment["validateRelease"]>(),
  archiveRelease: jest.fn<Environment["archiveRelease"]>(),
  unarchiveRelease: jest.fn<Environment["unarchiveRelease"]>(),
  getReleaseAction: jest.fn<Environment["getReleaseAction"]>(),
  getReleaseActions: jest.fn<Environment["getReleaseActions"]>(),
  getUIConfig: jest.fn<Environment["getUIConfig"]>(),
  getUserUIConfig: jest.fn<Environment["getUserUIConfig"]>(),
  getEnvironmentTemplateInstallations:
    jest.fn<Environment["getEnvironmentTemplateInstallations"]>(),
  toPlainObject: jest.fn<Environment["toPlainObject"]>(),
  getPublishedAssets: jest.fn<Environment["getPublishedAssets"]>(),
  createAppAccessToken: jest.fn<Environment["createAppAccessToken"]>(),
  ...environment
});

export default createEnvironment;
