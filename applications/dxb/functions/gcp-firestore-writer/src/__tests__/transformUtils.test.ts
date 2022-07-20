import { createAsset } from "@bmi/pim-types";
import {
  getVideoUrl,
  isImageAsset,
  isLinkAsset,
  mapDocuments
} from "../transformerUtils";

describe("transformUtils tests", () => {
  describe("isImageAsset tests", () => {
    it("handles empty realFileName", () => {
      const asset = createAsset({
        realFileName: undefined,
        url: undefined
      });
      const result = isImageAsset(asset);
      expect(result).toBeFalsy();
    });
  });
  describe("isLinkAsset tests", () => {
    it("handles empty realFileName and url", () => {
      const asset = createAsset({
        realFileName: undefined,
        url: undefined
      });
      const result = isLinkAsset(asset);
      expect(result).toBeFalsy();
    });
  });
  describe("mapDocuments tests", () => {
    it("handles non image assets", () => {
      const asset = createAsset({
        assetType: "WARRANTIES",
        format: "image/webp",
        mime: "image/webp"
      });
      const result = mapDocuments([asset]);
      expect(result).toEqual([]);
    });

    it("handles non image format", () => {
      const asset = createAsset({
        assetType: "WARRANTIES",
        format: "application/zip",
        mime: undefined,
        realFileName: "test"
      });
      const result = mapDocuments([asset]);
      expect(result).toEqual([
        {
          assetType: "WARRANTIES",
          extension: "test",
          fileSize: 10,
          format: undefined,
          id: "2583923841",
          isLinkDocument: false,
          realFileName: "test",
          title: "name",
          url: "http://localhost:8000"
        }
      ]);
    });
    it("handles assets with no mime or format", () => {
      const asset = createAsset({
        assetType: "WARRANTIES",
        format: undefined,
        mime: undefined,
        realFileName: undefined
      });
      const result = mapDocuments([asset]);
      expect(result).toEqual([]);
    });
  });

  describe("getVideoUrl", () => {
    it("should return empty string when URL is undefined", () => {
      expect(getVideoUrl(undefined)).toEqual("");
    });

    it("should return URL when URL starts with https", () => {
      expect(
        getVideoUrl("https://www.youtube.com/watch?v=3901c0ds7oo")
      ).toEqual("https://www.youtube.com/watch?v=3901c0ds7oo");
    });

    it("should return full YouTube URL when URL is just the ID", () => {
      expect(getVideoUrl("3901c0ds7oo")).toEqual(
        "https://www.youtube.com/watch?v=3901c0ds7oo"
      );
    });
  });
});
