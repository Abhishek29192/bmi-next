import {
  GetMediaFoldersQuery,
  GetMediaItemByIdQuery
} from "../../graphql/generated/operations";

export type MediaFolders =
  GetMediaFoldersQuery["mediaFolderCollection"]["items"];

export type RootFolders =
  GetMediaFoldersQuery["marketContentCollection"]["items"][0]["mediaLibraryRootCollection"]["items"];

export type MediaTool =
  GetMediaItemByIdQuery["mediaToolCollection"]["items"][0];

export type MediaFolder =
  GetMediaItemByIdQuery["mediaFolderCollection"]["items"][0];

export type MediaItem = MediaTool | MediaFolder;
