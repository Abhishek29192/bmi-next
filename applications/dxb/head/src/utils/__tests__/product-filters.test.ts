import {
  groupDistinctBy,
  removePLPFilterPrefix,
  groupBy,
  IndexedItemGroup
} from "../product-filters";

type ImageItem = {
  name: string;
  type: "jpg" | "gif" | "svg";
  brand: string;
};

describe("product-filters tests", () => {
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
  describe("removePLPFilterPrefix tests", () => {
    it("When null value is passed ", () => {
      const result = removePLPFilterPrefix(null);
      expect(result).toEqual("");
    });
    it("When undefined value is passed ", () => {
      const result = removePLPFilterPrefix(undefined);
      expect(result).toEqual("");
    });
    it("When string without any 'plpFilter.' prefix is passed ", () => {
      const result = removePLPFilterPrefix("test");
      expect(result).toEqual("test");
    });
    it("When string with 'plpFilter.' prefix is passed ", () => {
      const result = removePLPFilterPrefix("plpFilter.TEST_VALUE");
      expect(result).toEqual("TEST_VALUE");
    });
  });

  describe("groupDistinctBy tests", () => {
    describe("When empty collection is passed ", () => {
      it("returns empty object", () => {
        const result = groupDistinctBy([], "categoryType", "code");
        expect(result).toEqual({});
      });
    });
    describe("When null collection is passed ", () => {
      it("returns empty object", () => {
        const result = groupDistinctBy([], "categoryType", "code");
        expect(result).toEqual({});
      });
    });

    describe("When NO duplicate distinct by value exists", () => {
      it("returns grouped objects by given property key", () => {
        const categories = [
          {
            name: "AeroDeck_2",
            categoryType: "Brand",
            code: "AeroDeck_2"
          },
          {
            categoryType: "Brand",
            code: "AeroDeck",
            name: "AeroDeck"
          },
          {
            name: "category_1",
            categoryType: "Category",
            code: "category_1"
          },
          {
            categoryType: "Category",
            code: "category_2",
            name: "category_2"
          }
        ];
        const result = groupDistinctBy(categories, "categoryType", "code");
        expect(result).toEqual({
          Brand: [
            { name: "AeroDeck_2", categoryType: "Brand", code: "AeroDeck_2" },
            { categoryType: "Brand", code: "AeroDeck", name: "AeroDeck" }
          ],
          Category: [
            {
              name: "category_1",
              categoryType: "Category",
              code: "category_1"
            },
            { categoryType: "Category", code: "category_2", name: "category_2" }
          ]
        });
      });
    });

    describe("When duplicate distinct by value exists", () => {
      it("returns grouped objects with distinct values by given distinct by property key", () => {
        const categories = [
          {
            name: "AeroDeck",
            categoryType: "Brand",
            code: "AeroDeck"
          },
          {
            categoryType: "Brand",
            code: "AeroDeck",
            name: "AeroDeck"
          }
        ];
        const result = groupDistinctBy(categories, "categoryType", "code");
        expect(result).toEqual({
          Brand: [{ name: "AeroDeck", categoryType: "Brand", code: "AeroDeck" }]
        });
      });
    });
    describe("When duplicate distinct exists in different groups", () => {
      it("returns grouped objects with distinct values by given distinct by property key", () => {
        const categories = [
          {
            name: "AeroDeck",
            categoryType: "Category",
            code: "AeroDeck"
          },
          {
            categoryType: "Brand",
            code: "AeroDeck",
            name: "AeroDeck"
          }
        ];
        const result = groupDistinctBy(categories, "categoryType", "code");
        expect(result).toEqual({
          Brand: [
            { name: "AeroDeck", categoryType: "Brand", code: "AeroDeck" }
          ],
          Category: [
            { name: "AeroDeck", categoryType: "Category", code: "AeroDeck" }
          ]
        });
      });
    });
  });
});
