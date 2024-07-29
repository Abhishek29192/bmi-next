import { createAsset, createCategory, createImage } from "@bmi/pim-types";
import {
  ImageFormat,
  Image,
  ImageAssetType
} from "@bmi/pim-types/src/types.js";
import {
  cleanImageName,
  getBrand,
  getCategories,
  getVideoUrl,
  isImageAsset,
  isLinkAsset,
  mapDocuments,
  mapImages
} from "../transformerUtils.js";

const imageFormat: ImageFormat[] = [
  "Product-Hero-Small-Desktop-Tablet",
  "Product-Hero-Large-Desktop",
  "Product-Hero-Mobile",
  "Product-Listing-Card-Large-Desktop",
  "Product-Color-Selector-Mobile",
  "Product-Color-Selector-Small-Desktop-Tablet",
  "Product-Listing-Card-Small-Desktop-Tablet",
  "Product-Color-Selector-Large-Desktop",
  "Product-Listing-Card-Mobile",
  "Web",
  "Print"
];

describe("transformUtils tests", () => {
  describe("getCategories", () => {
    it("should return an empty array if an empty list array", () => {
      expect(getCategories([])).toEqual([]);
    });

    it("should filter categories of type Channel out", () => {
      const brandCategory = createCategory({ categoryType: "Brand" });
      const categoryCategory = createCategory({ categoryType: "Category" });
      const channelCategory = createCategory({ categoryType: "Channel" });
      const productFamilyCategory = createCategory({
        categoryType: "ProductFamily"
      });
      const productLine = createCategory({ categoryType: "ProductLine" });
      const categories = [
        brandCategory,
        categoryCategory,
        channelCategory,
        productFamilyCategory,
        productLine
      ];
      const expectedCategories = [
        brandCategory,
        categoryCategory,
        productFamilyCategory,
        productLine
      ];
      expect(getCategories(categories)).toEqual(expectedCategories);
    });
  });

  describe("getBrands", () => {
    it("should return brand, code and logo as BMI when Brand is an empty array", () => {
      const brandCategory = createCategory({
        code: "BMI",
        name: "BMI",
        image: {
          allowedToDownload: true,
          fileSize: 10,
          mime: "image/png",
          name: "BMI",
          realFileName: "BMI",
          url: "http://localhost:8000"
        }
      });

      const newBrands = [brandCategory];
      const expectedBrand = {
        name: "BMI",
        code: "BMI",
        logo: "BMI"
      };

      expect(getBrand(newBrands)).toEqual(expectedBrand);
    });

    it("should return brand, code and logo when there are more than one brands attached to a product", () => {
      const firstBrand = createCategory({ categoryType: "Brand" });
      const secondBrand = createCategory({
        categoryType: "Brand"
      });

      const newBrands = [firstBrand, secondBrand];
      const expectedBrand = {
        name: "BMI",
        code: "BMI",
        logo: "BMI"
      };
      expect(getBrand(newBrands)).toEqual(expectedBrand);
    });

    it("should return brand, code and logo as BMI when Brand is undfined", () => {
      expect(getBrand()).toEqual({ name: "BMI", code: "BMI", logo: "BMI" });
    });

    it("should return brand, code, and logo of first brand if only one brand is attached to product", () => {
      const brand = createCategory({ categoryType: "Brand" });

      const newBrands = [brand];
      const expectedBrand = {
        name: "name",
        code: "code",
        logo: "http://localhost:8000"
      };
      expect(getBrand(newBrands)).toEqual(expectedBrand);
    });
  });

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
    it("mapsDocuments if assets are undefined", () => {
      const result = mapDocuments(undefined);
      expect(result).toEqual([]);
    });

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

  describe("cleanImageName", () => {
    it(`should remove the file extension from the imageName, if present`, () => {
      const imageName = "30162812 Klebeasfalt.tiff";
      const format = "Product-Hero-Small-Desktop-Tablet";
      expect(cleanImageName(imageName, format)).toBe("30162812 Klebeasfalt");
    });

    describe("imageFormat", () => {
      imageFormat.forEach((format) => {
        it(`should remove the image format ${format} if the format is defined`, () => {
          const imageName = `${format}_30162812 Klebeasfalt`;
          expect(cleanImageName(imageName, format)).toBe(
            "30162812 Klebeasfalt"
          );
        });
      });
    });

    it("it should not remove the format if format is undefined", () => {
      const imageName =
        "Product-Hero-Small-Desktop-Tablet_30162812 Klebeasfalt";
      const format = undefined;
      expect(cleanImageName(imageName, format)).toBe(
        "Product Hero Small Desktop Tablet 30162812 Klebeasfalt"
      );
    });

    it("it should remove any leading underscores and replace it with an empty string", () => {
      const imageName = "_30162812 Klebeasfalt";
      const format = "Product-Hero-Small-Desktop-Tablet";
      expect(cleanImageName(imageName, format)).toBe("30162812 Klebeasfalt");
    });

    it("it should remove any leading hyphens and replace it with an empty string", () => {
      const imageName = "-30162812 Klebeasfalt";
      const format = "Product-Hero-Small-Desktop-Tablet";
      expect(cleanImageName(imageName, format)).toBe("30162812 Klebeasfalt");
    });

    it("it should remove all leading spaces before the string", () => {
      const imageName = "       30162812 Klebeasfalt";
      const format = "Product-Hero-Small-Desktop-Tablet";
      expect(cleanImageName(imageName, format)).toBe("30162812 Klebeasfalt");
    });

    it("it should replace any underscores in the middle of the string with a blank space", () => {
      const imageName = "bmi_zanda";
      const format = "Product-Hero-Small-Desktop-Tablet";
      expect(cleanImageName(imageName, format)).toBe("bmi zanda");
    });

    it("it should replace any hyphens in the middle of the string with a blank space", () => {
      const imageName = "30162812-Klebeasfalt";
      const format = "Product-Hero-Small-Desktop-Tablet";
      expect(cleanImageName(imageName, format)).toBe("30162812 Klebeasfalt");
    });
  });

  describe("mapImages", () => {
    it("should correctly set mainSource and altText when image format is Product-Hero-Small-Desktop-Tablet and altText is provided", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: "Product-Hero-Small-Desktop-Tablet",
            name: "Product-Hero-Small-Desktop-Tablet_30162812-Klebeasfalt.png",
            altText: "example-alt-text"
          })
        ]
      ];
      const result = mapImages(pimImages, "MASTER_IMAGE");

      expect(result[0].mainSource).toBe("http://localhost:8000");
      expect(result[0].altText).toBe("example-alt-text");
    });

    it("should correctly set mainSource and altText when image format is Product-Hero-Small-Desktop-Tablet and altText is not provided, using the imageName as fallback", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: "Product-Hero-Small-Desktop-Tablet",
            name: "Product-Hero-Small-Desktop-Tablet-Miljøbilde trend Web",
            altText: undefined
          })
        ]
      ];
      const result = mapImages(pimImages, "MASTER_IMAGE");

      expect(result[0].mainSource).toBe("http://localhost:8000");
      expect(result[0].altText).toBe("Miljøbilde trend Web");
    });

    it("should not set a thumbnail property when image format is Product-Hero-Small-Desktop-Tablet", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: "Product-Hero-Small-Desktop-Tablet"
          })
        ]
      ];

      const result = mapImages(pimImages, "MASTER_IMAGE");
      expect(result[0].thumbnail).toBeUndefined();
    });

    it("should correctly set the altText property when the image format is undefined, one other image in the array has a mainSource defined and altText is undefined", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: "Product-Hero-Small-Desktop-Tablet",
            name: "Product-Hero-Small-Desktop-Tablet_30162812-Klebeasfalt.png",
            altText: undefined
          }),
          createImage({
            format: undefined,
            name: "Product-Hero-Small-Desktop-Tablet_bmi_zanda.png",
            altText: undefined
          })
        ]
      ];

      const result = mapImages(pimImages, "MASTER_IMAGE");
      expect(result[0].altText).toBe(
        "Product Hero Small Desktop Tablet bmi zanda"
      );
    });

    it("should correctly set the altText property when image format is undefined, one other image in the array has a mainSource defined and altText is defined", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: "Product-Hero-Small-Desktop-Tablet",
            name: "Product-Hero-Small-Desktop-Tablet_30162812-Klebeasfalt.png",
            altText: undefined
          }),
          createImage({
            format: undefined,
            name: "Product-Hero-Small-Desktop-Tablet_30162812-Klebeasfalt.png",
            altText: "example-alt-text"
          })
        ]
      ];

      const result = mapImages(pimImages, "MASTER_IMAGE");
      expect(result[0].altText).toBe("example-alt-text");
    });

    it("should correctly set the altText property when the original image does not have an altText", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: "Product-Hero-Small-Desktop-Tablet",
            name: "Product-Hero-Small-Desktop-Tablet_30162812-Klebeasfalt.png",
            altText: "example-alt-text"
          }),
          createImage({
            format: undefined,
            name: "Product-Hero-Small-Desktop-Tablet_30162812-Klebeasfalt.png",
            altText: undefined
          })
        ]
      ];

      const result = mapImages(pimImages, "MASTER_IMAGE");
      console.log(result);
      expect(result[0].altText).toBe("example-alt-text");
    });

    it("should return an empty array if none of the images have a Product-Hero-Small-Desktop-Tablet format", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: "Product-Color-Selector-Mobile"
          }),
          createImage({
            format: undefined
          })
        ]
      ];

      const result = mapImages(pimImages, "MASTER_IMAGE");
      expect(result).toEqual([]);
    });

    it("should create a fully populated image object, when all conditions are met", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: "Product-Hero-Small-Desktop-Tablet",
            name: "Product-Hero-Small-Desktop-Tablet_30162812-Klebeasfalt.png",
            altText: undefined
          }),
          createImage({
            format: "Product-Color-Selector-Mobile",
            name: "Product-Color-Selector-Mobile_bmi-zanda.png",
            altText: undefined
          }),
          createImage({
            format: undefined,
            name: "Product-Hero-Small-Desktop-Tablet_bmi_icopal.png",
            altText: undefined
          })
        ]
      ];
      const result = mapImages(pimImages, "MASTER_IMAGE");

      expect(result[0].altText).toBe(
        "Product Hero Small Desktop Tablet bmi icopal"
      );
      expect(result[0].mainSource).toBe("http://localhost:8000");
      expect(result[0].thumbnail).toBe("http://localhost:8000");
    });

    it("should filter out arrays with undefined image objects (i.e. no defined mainSource or thumbnail properties)", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: "Product-Hero-Small-Desktop-Tablet"
          }),
          createImage({
            format: "Product-Color-Selector-Mobile"
          }),
          createImage({
            format: undefined
          })
        ],
        [
          createImage({
            format: undefined
          })
        ]
      ];

      const result = mapImages(pimImages, "MASTER_IMAGE");
      expect(result).toHaveLength(1);
    });

    describe("assetTypes", () => {
      const assetTypes: ImageAssetType[] = [
        "GALLERY",
        "MASTER_IMAGE",
        "TECHNICAL_DRAWINGS"
      ];

      const combinations = assetTypes
        .flatMap((pimImagesAssetType) =>
          assetTypes.map((mapImagesAssetType) => [
            pimImagesAssetType,
            mapImagesAssetType
          ])
        )
        .filter(
          ([pimImagesAssetType, mapImagesAssetType]) =>
            pimImagesAssetType !== mapImagesAssetType
        );

      it.each(combinations)(
        "should not return an image array if the asset type in pimImages is %s and the asset type in mapImages is %s",
        (pimImagesAssetType, mapImagesAssetType) => {
          const pimImages: readonly Image[][] = [
            [
              createImage({
                format: undefined,
                assetType: pimImagesAssetType
              })
            ]
          ];

          const result = mapImages(pimImages, mapImagesAssetType);
          expect(result).toEqual([]);
        }
      );
    });

    it("it should return an empty array if image arrays contain defined image objects", () => {
      const pimImages: readonly Image[][] = [
        [
          createImage({
            format: undefined
          })
        ]
      ];
      const result = mapImages(pimImages, "MASTER_IMAGE");
      expect(result).toEqual([]);
    });

    describe("image format", () => {
      const excludeImageFormat: ImageFormat[] = [
        "Product-Hero-Large-Desktop",
        "Product-Hero-Mobile",
        "Product-Listing-Card-Large-Desktop",
        "Product-Color-Selector-Small-Desktop-Tablet",
        "Product-Listing-Card-Small-Desktop-Tablet",
        "Product-Color-Selector-Large-Desktop",
        "Product-Listing-Card-Mobile",
        "Web",
        "Print"
      ];

      excludeImageFormat.forEach((format) => {
        it(`should not return an image array if the image format is ${format}`, () => {
          const pimImages: readonly Image[][] = [
            [
              createImage({
                format: format
              })
            ]
          ];

          const result = mapImages(pimImages, "MASTER_IMAGE");
          expect(result).toEqual([]);
        });
      });
    });
  });
});
