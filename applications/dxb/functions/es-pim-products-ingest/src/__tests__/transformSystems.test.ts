import { Category, createSystem } from "@bmi/pim-types";
import { transformSystem } from "../transformSystems";

describe("transformSystem", () => {
  it("should transform system to object", () => {
    const system = createSystem();
    const { approvalStatus, type, images, code, name, shortDescription } =
      system;
    const brand = system.categories.find(
      ({ parentCategoryCode }) => parentCategoryCode === "BMI_Brands"
    )?.code;

    expect(transformSystem(system)).toStrictEqual({
      brand,
      approvalStatus,
      type,
      images,
      code,
      name,
      shortDescription
    });
  });

  it("should transform system to object without brand", () => {
    const system = createSystem({ categories: [] });
    const { approvalStatus, type, images, code, name, shortDescription } =
      system;

    expect(transformSystem(system)).toStrictEqual({
      brand: undefined,
      approvalStatus,
      type,
      images,
      code,
      name,
      shortDescription
    });
  });

  it("should find brand Category by categoryType", () => {
    const brandCategory: Category = {
      categoryType: "Brand",
      code: "MONARFLEX",
      name: "Monarflex",
      parentCategoryCode: "BMI_Brands"
    };

    const system = createSystem({ categories: [brandCategory] });
    const { approvalStatus, type, images, code, name, shortDescription } =
      system;

    expect(transformSystem(system)).toStrictEqual({
      brand: brandCategory.code,
      approvalStatus,
      type,
      images,
      code,
      name,
      shortDescription
    });
  });

  it("should not find brand Category if no brand categoryType", () => {
    const brandCategory: Category = {
      categoryType: "Category",
      code: "MONARFLEX",
      name: "Monarflex",
      parentCategoryCode: "BMI_Brands"
    };

    const system = createSystem({ categories: [brandCategory] });
    const { approvalStatus, type, images, code, name, shortDescription } =
      system;

    expect(transformSystem(system)).toStrictEqual({
      brand: undefined,
      approvalStatus,
      type,
      images,
      code,
      name,
      shortDescription
    });
  });
});
