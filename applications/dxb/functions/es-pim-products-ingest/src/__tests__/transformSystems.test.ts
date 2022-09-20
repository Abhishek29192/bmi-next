import {
  Category,
  createClassification,
  createImage,
  createSystem,
  System
} from "@bmi/pim-types";
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
    const { approvalStatus, type, code, name, shortDescription } = system;
    const brand = getBrand(system);
    const scoringWeight = getScoringWeight(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      approvalStatus,
      brand,
      code,
      hashedCode: "hashed-system-code",
      images: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      name,
      path: "/s/generated-url",
      scoringWeight,
      shortDescription,
      type
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should transform system to object without categories", () => {
    const system = createSystem({ categories: undefined });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const scoringWeight = getScoringWeight(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand: undefined,
      approvalStatus,
      type,
      images: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      code,
      name,
      scoringWeight,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should transform system to object without brand", () => {
    const system = createSystem({ categories: [] });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const scoringWeight = getScoringWeight(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand: undefined,
      approvalStatus,
      type,
      images: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      code,
      name,
      scoringWeight,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should find brand Category by categoryType", () => {
    const brandCategory: Category = {
      categoryType: "Brand",
      code: "MONARFLEX",
      name: "Monarflex",
      parentCategoryCode: "NOT_NEEDED_Brands"
    };

    const system = createSystem({ categories: [brandCategory] });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const scoringWeight = getScoringWeight(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand: brandCategory,
      approvalStatus,
      type,
      images: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      code,
      name,
      scoringWeight,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should not find brand Category if no brand categoryType", () => {
    const brandCategory: Category = {
      categoryType: "Category",
      code: "MONARFLEX",
      name: "Monarflex",
      parentCategoryCode: "NOT_NEEDED_Brands"
    };

    const system = createSystem({ categories: [brandCategory] });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const scoringWeight = getScoringWeight(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand: undefined,
      approvalStatus,
      type,
      images: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      code,
      name,
      scoringWeight,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should transform system to object without classifications", () => {
    const system = createSystem({ classifications: undefined });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const brand = getBrand(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand,
      approvalStatus,
      type,
      images: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      code,
      name,
      scoringWeight: 0,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should transform system to object without classification features", () => {
    const system = createSystem({
      classifications: [createClassification({ features: undefined })]
    });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const brand = getBrand(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand,
      approvalStatus,
      type,
      images: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      code,
      name,
      scoringWeight: 0,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should transform system to object without scoring weight", () => {
    const system = createSystem({ classifications: [] });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const brand = getBrand(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand,
      approvalStatus,
      type,
      images: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      code,
      name,
      scoringWeight: 0,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should transform system to object without images", () => {
    const system = createSystem({ images: undefined });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const brand = getBrand(system);
    const scoringWeight = getScoringWeight(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand,
      approvalStatus,
      type,
      images: [],
      code,
      name,
      scoringWeight,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should transform system to object with image that only has thumbnail", () => {
    const system = createSystem({
      images: [
        createImage({
          assetType: "MASTER_IMAGE",
          format: "Product-Color-Selector-Mobile"
        })
      ]
    });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const brand = getBrand(system);
    const scoringWeight = getScoringWeight(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand,
      approvalStatus,
      type,
      images: [
        {
          altText: undefined,
          mainSource: undefined,
          thumbnail: "http://localhost:8000"
        }
      ],
      code,
      name,
      scoringWeight,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should transform system to object without empty list of images", () => {
    const system = createSystem({ images: [] });
    const { approvalStatus, type, code, name, shortDescription } = system;
    const brand = getBrand(system);
    const scoringWeight = getScoringWeight(system);
    generateHashFromString.mockReturnValue("hashed-system-code");
    generateUrl.mockReturnValue("generated-url");

    expect(transformSystem(system)).toStrictEqual({
      brand,
      approvalStatus,
      type,
      images: [],
      code,
      name,
      scoringWeight,
      shortDescription,
      hashedCode: "hashed-system-code",
      path: "/s/generated-url"
    });
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });
});

const getBrand = (system: System) =>
  system.categories!.find(({ categoryType }) => categoryType === "Brand");

const getScoringWeight = (system: System) =>
  Number.parseInt(
    system
      .classifications!.find((classification) =>
        classification.features!.some(
          (feature) =>
            feature.code.split("/").pop() ===
            "scoringWeightAttributes.scoringweight"
        )
      )!
      .features!.find(
        (feature) =>
          feature.code.split("/").pop() ===
          "scoringWeightAttributes.scoringweight"
      )!.featureValues[0].value
  );
