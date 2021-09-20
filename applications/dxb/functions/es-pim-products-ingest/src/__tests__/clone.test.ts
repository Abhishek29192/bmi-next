import mockConsole from "jest-mock-console";
import {
  ESIndexObject,
  groupBy,
  IndexedItemGroup,
  IndexFeatures
} from "../CLONE";
import { Classification } from "../pim";
import createClassification, {
  createFeature,
  createFeatureValue
} from "./helpers/ClassificationHelper";

beforeAll(() => {
  mockConsole();
});

type ImageItem = {
  name: string;
  type: "jpg" | "gif" | "svg";
  brand: string;
};

describe("CLONE tests", () => {
  describe("groupBy tests", () => {
    it("should return empty object when empty array is provided", () => {
      expect(groupBy([], "")).toEqual({});
    });
    it("should return empty object when empty array with unknown key is provided", () => {
      expect(groupBy([], "test")).toEqual({});
    });

    describe("typed object tests", () => {
      it("should return images grouped by type", () => {
        const imageGallery: Array<ImageItem> = [
          { name: "image_1", type: "gif", brand: "aerodek" },
          { name: "image_3", type: "gif", brand: "aerodek" },
          { name: "image_4", type: "jpg", brand: "icopal" },
          { name: "image_2", type: "gif", brand: "aerodek" },
          { name: "image_5", type: "jpg", brand: "icopal" },
          { name: "image_6", type: "svg", brand: "aerodek" }
        ];
        const result: IndexedItemGroup<ImageItem> = groupBy(
          imageGallery,
          "type"
        );
        expect(Object.keys(result).length).toEqual(3);
        expect(result["gif"].length).toEqual(3);
        expect(result["jpg"].length).toEqual(2);
        expect(result["svg"].length).toEqual(1);
      });

      it("should return images grouped by brand", () => {
        const imageGallery: Array<ImageItem> = [
          { name: "image_1", type: "gif", brand: "aerodek" },
          { name: "image_3", type: "gif", brand: "aerodek" },
          { name: "image_4", type: "jpg", brand: "icopal" },
          { name: "image_2", type: "gif", brand: "aerodek" },
          { name: "image_5", type: "jpg", brand: "icopal" },
          { name: "image_6", type: "svg", brand: "aerodek" }
        ];
        const result: IndexedItemGroup<ImageItem> = groupBy(
          imageGallery,
          "brand"
        );
        expect(Object.keys(result).length).toEqual(2);
        expect(result["aerodek"].length).toEqual(4);
        expect(result["icopal"].length).toEqual(2);
      });
    });
  });
  describe("IndexFeatures tests", () => {
    it("should return empty object when empty array is passed", () => {
      const result: IndexedItemGroup<ESIndexObject> = IndexFeatures("", []);
      expect(result).toEqual({});
    });

    describe("When single classification with NO features is passed", () => {
      it("should return empty object", () => {
        const classifications: Array<Classification> = [
          createClassification({ features: [] })
        ];
        const result: IndexedItemGroup<ESIndexObject> = IndexFeatures(
          "",
          classifications
        );
        expect(result).toEqual({});
      });
    });
    describe("When single classification and single feature is passed with PIM classification namespace", () => {
      it("should return indexed object without namespace", () => {
        const classifications: Array<Classification> = [
          createClassification({
            features: [
              createFeature({ code: "pim-namespace/1.0/feature-code-1" })
            ]
          })
        ];
        const result: IndexedItemGroup<ESIndexObject> = IndexFeatures(
          "pim-namespace/1.0",
          classifications
        );
        expect(result).toEqual({
          "feature-code-1": [
            {
              code: "valuesymbol",
              name: "value symbol"
            }
          ]
        });
      });
    });

    describe("When single classification and single feature is passed", () => {
      it("should return indexed object with feature code", () => {
        const classifications: Array<Classification> = [createClassification()];
        const result: IndexedItemGroup<ESIndexObject> = IndexFeatures(
          "",
          classifications
        );
        expect(result).toEqual({
          "classification-feature-code": [
            {
              code: "valuesymbol",
              name: "value symbol"
            }
          ]
        });
      });
    });

    describe("When single classification and multiple feature values are passed", () => {
      it("should return indexed object with feature code", () => {
        const classifications: Array<Classification> = [
          createClassification({
            features: [
              createFeature({
                featureValues: [
                  createFeatureValue({ code: "value-code1", value: "value-1" }),
                  createFeatureValue({ code: "value-code2", value: "value-2" }),
                  createFeatureValue({ code: "value-code3", value: "value-3" })
                ]
              })
            ]
          })
        ];
        const result: IndexedItemGroup<ESIndexObject> = IndexFeatures(
          "",
          classifications
        );
        expect(result).toEqual({
          "classification-feature-code": [
            {
              code: "value-1symbol",
              name: "value-1 symbol"
            },
            {
              code: "value-2symbol",
              name: "value-2 symbol"
            },
            {
              code: "value-3symbol",
              name: "value-3 symbol"
            }
          ]
        });
      });
    });
  });
});
