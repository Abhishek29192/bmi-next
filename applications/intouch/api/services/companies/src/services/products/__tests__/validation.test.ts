import { Product, System, SystemMember } from "@bmi/intouch-api-types";
import { validateItems, validateProductsAndSystems } from "../validation";

export const item = (index: number, replace = null, type = "product"): any => ({
  technology: replace?.technology || "FLAT",
  bmiRef: replace?.bmiRef || `ref-${type}-${index}`,
  brand: "Braas",
  family: "Asoka",
  name: `Super Tile ${index}`,
  description: "This is some test data.  There is no such physical product",
  published: true,
  maximumValidityYears:
    replace?.maximumValidityYears !== undefined
      ? replace?.maximumValidityYears
      : 4
});

const systemMember = (index: number, replace = null) =>
  ({
    systemBmiRef: replace?.systemBmiRef || `ref-system-${index}`,
    productBmiRef: replace?.productBmiRef || `ref-product-${index}`
  } as SystemMember);

const products: Product[] = Array.from(Array(10).keys()).map(
  (key) => item(key) as Product
);
const systems: System[] = Array.from(Array(10).keys()).map(
  (key) => item(key, {}, "system") as System
);
const systemMembers: SystemMember[] = Array.from(Array(10).keys()).map(
  (key) => systemMember(key, {}) as SystemMember
);

describe("Validation", () => {
  describe("Product and Systems", () => {
    it("should return 0 error if all good", async () => {
      const errors = validateItems(products, "PRODUCT");
      expect(errors).toHaveLength(0);
    });
    it("should return an error if missing field", async () => {
      const newItem = item(11);
      delete newItem.brand;
      delete newItem.family;
      const errors = validateItems([...products, newItem], "PRODUCT");
      expect(errors).toHaveLength(2);
      expect(errors).toEqual([
        {
          ref: "ref-product-11",
          message: "brand is mandatory"
        },
        {
          ref: "ref-product-11",
          message: "family is mandatory"
        }
      ]);
    });
    it("should return an error if wrong technology", async () => {
      const errors = validateItems(
        [...products, item(11, { technology: "WRONG_TECH" })],
        "PRODUCT"
      );
      expect(errors).toHaveLength(1);
      expect(errors).toEqual([
        {
          ref: "ref-product-11",
          message: "Technology not allowed"
        }
      ]);
    });
    it("should return an error if double ref", async () => {
      const errors = validateItems(
        [...products, item(11, { bmiRef: "ref-product-1" })],
        "PRODUCT"
      );
      expect(errors).toHaveLength(1);
      expect(errors).toEqual([
        {
          ref: "ref-product-1",
          message: "Duplicate product"
        }
      ]);
    });
    it("should return an error if wrong validity data", async () => {
      const errors = validateItems(
        [...products, item(11, { bmiRef: "ref-product-1" })],
        "PRODUCT"
      );
      expect(errors).toHaveLength(1);
      expect(errors).toEqual([
        {
          ref: "ref-product-1",
          message: "Duplicate product"
        }
      ]);
    });
    it("should return an error if wrong tech and double ref", async () => {
      const errors = validateItems(
        [
          ...products,
          item(11, { maximumValidityYears: "foo" }),
          item(12, { maximumValidityYears: -1 }),
          item(13, { maximumValidityYears: null })
        ],
        "PRODUCT"
      );
      expect(errors).toHaveLength(4);
      expect(errors).toEqual([
        {
          ref: "ref-product-11",
          message: "Wrong maximum validity years"
        },
        {
          ref: "ref-product-12",
          message: "Wrong maximum validity years"
        },
        { message: "maximumValidityYears is mandatory", ref: "ref-product-13" },
        {
          ref: "ref-product-13",
          message: "Wrong maximum validity years"
        }
      ]);
    });
  });
  describe("SystemMembers", () => {
    it("shouldn't return an error", async () => {
      const errors = validateProductsAndSystems(
        systemMembers,
        products,
        systems
      );
      expect(errors).toHaveLength(0);
    });
    it("should return an error if product & system has different tech", async () => {
      const errors = validateProductsAndSystems(
        [...systemMembers, systemMember(11)],
        [...products, item(11)],
        [...systems, item(11, { technology: "WROTG" }, "system")]
      );
      expect(errors).toHaveLength(1);
      expect(errors).toEqual([
        {
          message: "Technology mismatch",
          ref: "ref-product-11 - ref-system-11"
        }
      ]);
    });
    it("should return an error if product & system not existing", async () => {
      const errors = validateProductsAndSystems(
        [...systemMembers, systemMember(11)],
        [...products, item(11)],
        [...systems]
      );
      expect(errors).toHaveLength(2);
      expect(errors).toEqual([
        {
          message: "System not existing",
          ref: "ref-product-11 - ref-system-11"
        },
        {
          message: "Technology mismatch",
          ref: "ref-product-11 - ref-system-11"
        }
      ]);
    });
  });
});
