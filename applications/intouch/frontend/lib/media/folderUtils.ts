import { GetMediaFoldersQuery } from "../../graphql/generated/operations";

export type MediaFolders =
  GetMediaFoldersQuery["mediaFolderCollection"]["items"];

export type RootFolders =
  GetMediaFoldersQuery["marketContentCollection"]["items"][0]["mediaLibraryRootCollection"]["items"];

export const getRootFolders = ({
  marketContentCollection
}: GetMediaFoldersQuery): RootFolders => {
  return marketContentCollection.items[0]?.mediaLibraryRootCollection?.items;
};

export const findFolderById = (allFolders: MediaFolders, folderId: string) => {
  return allFolders.find((f) => f.sys.id === folderId);
};

export const getParentFolder = (
  folder: MediaFolders[0],
  folders: MediaFolders
) =>
  folders.find((f) =>
    f.childrenCollection.items.find((child) => child.sys.id === folder.sys.id)
  );

export const getMediaItemPath = (
  folder: MediaFolders[0],
  allFolders: MediaFolders,
  rootFolders: RootFolders,
  currentPath: MediaFolders = []
) => {
  if (!folder) {
    return [];
  }
  const rootFolder = findFolderById(rootFolders, folder.sys.id);

  if (rootFolder) {
    return [rootFolder, ...currentPath];
  }
  return getMediaItemPath(
    getParentFolder(folder, allFolders),
    allFolders,
    rootFolders,
    [folder, ...currentPath]
  );
};
