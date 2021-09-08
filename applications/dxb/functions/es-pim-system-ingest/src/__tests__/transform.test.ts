import { transformSystem } from "../transform";
import type { Category } from "../pim";
import createSystem from "./helpers/SystemHelper";

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

  it("should find brand by categoryapprovalStatus, Type", () => {
    const brandCategory: Category = {
      categoryType: "Brand",
      code: "MONARFLEX",
      name: "Monarflex"
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

  it("should find brand by parentCategoryType", () => {
    const brandCategory: Category = {
      parentCategoryCode: "BMI_Brands",
      code: "MONARFLEX",
      name: "Monarflex"
    };

    const system = createSystem({ categories: [brandCategory] });
    const { approvalStatus, type, images, code, name, shortDescription } =
      system;

    expect(transformSystem(system)).toStrictEqual({
      approvalStatus,
      brand: brandCategory.code,
      type,
      images,
      code,
      name,
      shortDescription
    });
  });
});
