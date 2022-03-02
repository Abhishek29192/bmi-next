import { mockMediaFolderQueryResult } from "../../../fixtures/contentful/mediaFolderCollection";
import { generateMediaFolder } from "../../../lib/tests/factories/contentful/mediaFolder";
import { generateMediaTool } from "../../../lib/tests/factories/contentful/mediaTool";
import { MediaItem } from "../types";
import {
  findFolderById,
  formatFileSize,
  getMediaItemMeta,
  getMediaItemPath,
  getMediaItemSize,
  getParentFolder
} from "../utils";

const allFolders = mockMediaFolderQueryResult.mediaFolderCollection.items;
const rootFolders =
  mockMediaFolderQueryResult.marketContentCollection.items[0]
    .mediaLibraryRootCollection.items;

const KB = 1024;
const MB = KB * KB;

describe("mediaUtils", () => {
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
      const child = allFolders.find(
        (f) => f.sys.id === "4cMlAdSxDHY2S8mrU2jNzL"
      );
      expect(getParentFolder(child, allFolders)).toEqual(
        expect.objectContaining({
          sys: { id: "4nG2CwGJ5HYFjzmTudiKuX" },
          name: "Technical Information"
        })
      );
    });

    it("finds parent folder for a media tool", () => {
      const child = {
        __typename: "MediaTool",
        sys: {
          id: "22CAX9URDUN1rxH041V5jd"
        },
        name: "Horizon 8"
      };
      expect(getParentFolder(child as MediaItem, allFolders)).toEqual(
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
      const rootFolder = rootFolders.find(
        (f) => f.sys.id === "4nG2CwGJ5HYFjzmTudiKuX"
      );
      expect(getMediaItemPath(rootFolder, allFolders, rootFolders)).toEqual([
        expect.objectContaining(rootFolder)
      ]);
    });

    it("returns hierarchy for nested media folders + media tools", () => {
      const child = {
        __typename: "MediaTool",
        sys: {
          id: "4AUyMVzfgZIrLNBhrPD8RX"
        },
        name: "Advanced Contour"
      };
      expect(
        getMediaItemPath(child as MediaItem, allFolders, rootFolders)
      ).toEqual([
        expect.objectContaining({
          sys: { id: "4nG2CwGJ5HYFjzmTudiKuX" },
          name: "Technical Information"
        }),
        expect.objectContaining({
          sys: { id: "4cMlAdSxDHY2S8mrU2jNzL" },
          name: "Tiles Specification"
        }),
        expect.objectContaining(child)
      ]);
    });
  });

  describe("getMediaItemMeta", () => {
    it("folder", () => {
      expect(getMediaItemMeta(generateMediaFolder() as MediaItem)).toEqual(
        "FOLDER"
      );
    });
    it("pdf", () => {
      expect(
        getMediaItemMeta(generateMediaTool({ type: "pdf" }) as MediaItem)
      ).toEqual("PDF");
    });
    it("image", () => {
      expect(
        getMediaItemMeta(generateMediaTool({ type: "image" }) as MediaItem)
      ).toEqual("IMAGE");
    });
    it("vimeo", () => {
      expect(
        getMediaItemMeta(generateMediaTool({ type: "vimeo" }) as MediaItem)
      ).toEqual("VIDEO");
    });
    it("external", () => {
      expect(
        getMediaItemMeta(generateMediaTool({ type: "external" }) as MediaItem)
      ).toEqual("EXTERNAL_LINK");
    });
  });

  describe("formatFileSize", () => {
    it("returns the formatted file size - 0 kb", () => {
      expect(formatFileSize(0)).toEqual("0 Bytes");
    });
    it("returns the formatted file size - kb", () => {
      expect(formatFileSize(1024)).toEqual("1 KB");
    });
    it("returns the formatted file size - mb", () => {
      expect(formatFileSize(MB)).toEqual("1 MB");
    });
    it("returns the formatted file size - decimals + mb", () => {
      expect(formatFileSize(23.1 * MB)).toEqual("23.1 MB");
    });
  });

  describe("getMediaItemSize", () => {
    it("returns the formatted size - image", () => {
      expect(
        getMediaItemSize(
          generateMediaTool({
            type: "image",
            media: { size: 41.02 * MB }
          }) as MediaItem
        )
      ).toEqual("41.02 MB");
    });

    it("returns the formatted size - pdf", () => {
      expect(
        getMediaItemSize(
          generateMediaTool({
            type: "pdf",
            media: { size: 211.37 * MB }
          }) as MediaItem
        )
      ).toEqual("211.37 MB");
    });

    it("does not throw error for media tools without media", () => {
      expect(
        getMediaItemSize(generateMediaTool({ type: "external" }) as MediaItem)
      ).toEqual("");
    });
  });
});