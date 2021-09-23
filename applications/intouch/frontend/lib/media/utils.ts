import { GetMediaFoldersQuery } from "../../graphql/generated/operations";
import { MediaItem, MediaFolders, RootFolders, MediaTool } from "./types";

export const getRootFolders = ({
  marketContentCollection
}: GetMediaFoldersQuery): RootFolders => {
  return marketContentCollection.items[0]?.mediaLibraryRootCollection?.items;
};

export const findFolderById = (allFolders: MediaFolders, folderId: string) => {
  return allFolders.find((f) => f.sys.id === folderId);
};

export const getParentFolder = (mediaItem: MediaItem, folders: MediaFolders) =>
  folders.find((f) =>
    f.childrenCollection.items.find(
      (child) => child.sys.id === mediaItem.sys.id
    )
  );

export const getMediaItemPath = (
  mediaItem: MediaItem,
  allFolders: MediaFolders,
  rootFolders: RootFolders,
  currentPath: MediaItem[] = []
) => {
  if (!mediaItem) {
    return [];
  }
  const rootFolder = findFolderById(rootFolders, mediaItem.sys.id);

  if (rootFolder) {
    return [rootFolder, ...currentPath];
  }
  return getMediaItemPath(
    getParentFolder(mediaItem, allFolders),
    allFolders,
    rootFolders,
    [mediaItem, ...currentPath]
  );
};

const META_TYPES = {
  FOLDER: "FOLDER",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  EXTERNAL_LINK: "EXTERNAL_LINK",
  PDF: "PDF",
  FALLBACK: "MEDIA"
};

export const getMediaItemMeta = (mediaItem: MediaItem) => {
  if (mediaItem.__typename === "MediaFolder") {
    return META_TYPES.FOLDER;
  }
  if (mediaItem.url) {
    return mediaItem.url.includes("vimeo")
      ? META_TYPES.VIDEO
      : META_TYPES.EXTERNAL_LINK;
  }
  const contentType = mediaItem.media?.contentType;
  if (!contentType) {
    return META_TYPES.FALLBACK;
  }
  if (contentType.includes("image")) {
    return META_TYPES.IMAGE;
  }
  if (contentType.includes("pdf")) {
    return META_TYPES.PDF;
  }
  if (contentType.includes("video")) {
    return META_TYPES.VIDEO;
  }
  return META_TYPES.FALLBACK;
};

export const getMediaItemSize = (mediaItem: MediaItem) => {
  if (mediaItem.__typename !== "MediaTool" || !mediaItem.media) {
    return "";
  }
  const numBytes = formatFileSize(mediaItem.media.size);
  return numBytes;
};

// taken from StackOverflow
// https://stackoverflow.com/a/18650828/5489631
export const formatFileSize = (bytes: number) => {
  if (typeof bytes === "undefined") {
    return "";
  }
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return [parseFloat((bytes / Math.pow(k, i)).toFixed(2)), sizes[`${i}`]].join(
    " "
  );
};

export const resizeContentfulImage = (url: string, maxWidth: number) => {
  return `${url}?w=${maxWidth}`;
};

export const getVimeoEmbedUrl = (mediaUrl: MediaTool["url"]) => {
  const videoId = mediaUrl.split("/").slice(-1)[0];
  return `https://player.vimeo.com/video/${videoId}`;
};

export const isVimeo = (mediaItem: MediaItem) => {
  return (
    mediaItem.__typename === "MediaTool" && mediaItem.url?.includes("vimeo")
  );
};

export const isExternalLink = (mediaItem: MediaItem) => {
  return (
    mediaItem.__typename === "MediaTool" &&
    mediaItem.url &&
    !mediaItem.url.includes("vimeo")
  );
};
