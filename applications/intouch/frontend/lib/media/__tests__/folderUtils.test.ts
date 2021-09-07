import { mockMediaFolderQueryResult } from "../../../fixtures/contentful/mediaFolderCollection";
import {
  findFolderById,
  getMediaItemPath,
  getParentFolder
} from "../folderUtils";

const allFolders = mockMediaFolderQueryResult.mediaFolderCollection.items;
const rootFolders =
  mockMediaFolderQueryResult.marketContentCollection.items[0]
    .mediaLibraryRootCollection.items;

describe("findFolderById", () => {
  it("handles no folderId", () => {
    expect(findFolderById(allFolders, undefined)).toBeUndefined();
  });

  it("finds the folder by id from the list of folders", () => {
    expect(findFolderById(allFolders, "4cMlAdSxDHY2S8mrU2jNzL")).toEqual(
      expect.objectContaining({
        sys: { id: "4cMlAdSxDHY2S8mrU2jNzL" },
        name: "Tiles Specification"
      })
    );
  });
});

describe("getParentFolder", () => {
  it("finds parent folder for another folder", () => {
    expect(
      getParentFolder(
        {
          sys: { id: "4cMlAdSxDHY2S8mrU2jNzL" },
          name: "Tiles Specification"
        },
        allFolders
      )
    ).toEqual(
      expect.objectContaining({
        sys: { id: "4nG2CwGJ5HYFjzmTudiKuX" },
        name: "Technical Information"
      })
    );
  });

  it("finds parent folder for a media tool", () => {
    expect(
      getParentFolder(
        {
          sys: {
            id: "22CAX9URDUN1rxH041V5jd"
          },
          name: "Horizon 8"
        },
        allFolders
      )
    ).toEqual(
      expect.objectContaining({
        sys: {
          id: "4cMlAdSxDHY2S8mrU2jNzL"
        },
        name: "Tiles Specification"
      })
    );
  });
});

describe("getMediaItemPath", () => {
  it("handles no folder", () => {
    expect(getMediaItemPath(null, allFolders, rootFolders)).toEqual([]);
  });

  it("returns 1 level for root folder", () => {
    const rootFolder = {
      sys: { id: "4nG2CwGJ5HYFjzmTudiKuX" },
      name: "Technical Information"
    };
    expect(getMediaItemPath(rootFolder, allFolders, rootFolders)).toEqual([
      expect.objectContaining(rootFolder)
    ]);
  });

  it("returns hierarchy for nested media folders + media tools", () => {
    const folder = {
      sys: { id: "4AUyMVzfgZIrLNBhrPD8RX" },
      name: "Advanced Contour"
    };

    expect(getMediaItemPath(folder, allFolders, rootFolders)).toEqual([
      expect.objectContaining({
        sys: { id: "4nG2CwGJ5HYFjzmTudiKuX" },
        name: "Technical Information"
      }),
      expect.objectContaining({
        sys: { id: "4cMlAdSxDHY2S8mrU2jNzL" },
        name: "Tiles Specification"
      }),
      expect.objectContaining(folder)
    ]);
  });
});
