import { MediaTool as ContentfulMediaTool } from "@bmi/intouch-api-types";
import {
  GetMediaFoldersQuery,
  GetMediaFolderContentsQuery
} from "../../graphql/generated/operations";

export type MediaFolders =
  GetMediaFoldersQuery["mediaFolderCollection"]["items"];

export type RootFolders =
  GetMediaFoldersQuery["marketContentCollection"]["items"][0]["mediaLibraryRootCollection"]["items"];

export type MediaFolder =
  GetMediaFolderContentsQuery["mediaFolderCollection"]["items"][0];

export type MediaTool = Omit<ContentfulMediaTool, "contentfulMetadata"> & {
  __typename: "MediaTool";
};

export type MediaItem = MediaFolder["childrenCollection"]["items"][0];

export type GalleryItem = {
  type: "image" | "pdf" | "vimeo";
  id: string;
  url: string;
  title: string;
  description?: string;
  fileUrl?: string;
};

export type MediaGalleryState = {
  isOpen: boolean;
  activeItem: GalleryItem;
};

export type ActiveMediaId = string;
