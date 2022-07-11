import { Category, createSystem } from "@bmi/pim-types";
import { transformSystem } from "../transformSystems";

const generateHashFromString = jest.fn();
const generateUrl = jest.fn();
jest.mock("@bmi/utils", () => ({
  generateHashFromString: (str: string, useDate: boolean) =>
    generateHashFromString(str, useDate),
  generateUrl: (parts: string[]) => generateUrl(parts)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("transformSystem", () => {
  it("should transform system to object", () => {
    const system = createSystem();
    const { approvalStatus, type, images, code, name, shortDescription } =
      system;
    const brand = system.categories.find(
      ({ categoryType }) => categoryType === "Brand"
    )?.code;
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand,
      approvalStatus,
      type,
      images,
      code,
      name,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([
      code,
      name,
      "hashed-system-code"
    ]);
  });

  it("should transform system to object without brand", () => {
    const system = createSystem({ categories: [] });
    const { approvalStatus, type, images, code, name, shortDescription } =
      system;
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand: undefined,
      approvalStatus,
      type,
      images,
      code,
      name,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([
      code,
      name,
      "hashed-system-code"
    ]);
  });

  it("should find brand Category by categoryType", () => {
    const brandCategory: Category = {
      categoryType: "Brand",
      code: "MONARFLEX",
      name: "Monarflex",
      parentCategoryCode: "NOT_NEEDED_Brands"
    };

    const system = createSystem({ categories: [brandCategory] });
    const { approvalStatus, type, images, code, name, shortDescription } =
      system;
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand: brandCategory.code,
      approvalStatus,
      type,
      images,
      code,
      name,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([
      code,
      name,
      "hashed-system-code"
    ]);
  });

  it("should not find brand Category if no brand categoryType", () => {
    const brandCategory: Category = {
      categoryType: "Category",
      code: "MONARFLEX",
      name: "Monarflex",
      parentCategoryCode: "NOT_NEEDED_Brands"
    };

    const system = createSystem({ categories: [brandCategory] });
    const { approvalStatus, type, images, code, name, shortDescription } =
      system;
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand: undefined,
      approvalStatus,
      type,
      images,
      code,
      name,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([
      code,
      name,
      "hashed-system-code"
    ]);
  });
});
