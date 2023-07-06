/* eslint-disable jest/no-focused-tests */
import {
  Category,
  Classification,
  createClassification,
  createImage,
  createSystem,
  createFeature,
  createFeatureValue,
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

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

describe("transformSystem", () => {
  it("should return undefined if system doesn't have a name", () => {
    const system = createSystem({ name: undefined });

    expect(transformSystem(system)).toBeUndefined();
    expect(generateHashFromString).not.toHaveBeenCalled();
    expect(generateUrl).not.toHaveBeenCalled();
  });

  it("should return undefined if system has a discontinued approval status", () => {
    const system = createSystem({ approvalStatus: "discontinued" });

    expect(transformSystem(system)).toBeUndefined();
    expect(generateHashFromString).not.toHaveBeenCalled();
    expect(generateUrl).not.toHaveBeenCalled();
  });

  it("should return undefined if system has an unapproved approval status", () => {
    const system = createSystem({ approvalStatus: "unapproved" });

    expect(transformSystem(system)).toBeUndefined();
    expect(generateHashFromString).not.toHaveBeenCalled();
    expect(generateUrl).not.toHaveBeenCalled();
  });

  it("should return undefined if system has a check approval status", () => {
    const system = createSystem({ approvalStatus: "check" });

    expect(transformSystem(system)).toBeUndefined();
    expect(generateHashFromString).not.toHaveBeenCalled();
    expect(generateUrl).not.toHaveBeenCalled();
  });

  it("should transform system to object when approval status is approved", () => {
    const system = createSystem({ approvalStatus: "approved" });
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
      galleryImages: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      masterImage: {
        altText: "name",
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000"
      },
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
      galleryImages: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      masterImage: {
        altText: "name",
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000"
      },
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
      galleryImages: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      masterImage: {
        altText: "name",
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000"
      },
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
      galleryImages: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      masterImage: {
        altText: "name",
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000"
      },
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
      galleryImages: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      masterImage: {
        altText: "name",
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000"
      },
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
      galleryImages: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      masterImage: {
        altText: "name",
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000"
      },
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
      galleryImages: [
        {
          altText: "name",
          mainSource: "http://localhost:8000",
          thumbnail: "http://localhost:8000"
        }
      ],
      masterImage: {
        altText: "name",
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000"
      },
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
      masterImage: {
        altText: "name",
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000"
      },
      galleryImages: [
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
      galleryImages: [],
      masterImage: undefined,
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

  it("should transform system to object with masterImage that only has thumbnail", () => {
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
      masterImage: {
        altText: undefined,
        mainSource: undefined,
        thumbnail: "http://localhost:8000"
      },
      galleryImages: [],
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
      galleryImages: [],
      masterImage: undefined,
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

  describe("systemattributes", () => {
    it("should transform system to object without systemattributes", () => {
      const system = createSystem({ classifications: [] });

      const { code, name } = system;
      generateHashFromString.mockReturnValueOnce("hashed-system-code");
      generateUrl.mockReturnValueOnce("generated-url");

      const transformedSystem = transformSystem(system);

      expect(transformedSystem).toEqual(
        expect.not.objectContaining({
          systemAttributes: getSystemAttributesDefaultValues()
        })
      );
      expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
      expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
    });
  });

  it("should transform system to object with systemattributes", () => {
    const system = createSystem({
      classifications: [createSystemAttributesClassification()]
    });
    const { code, name } = system;
    generateHashFromString.mockReturnValueOnce("hashed-system-code");
    generateUrl.mockReturnValueOnce("generated-url");

    const transformedSystem = transformSystem(system);

    expect(transformedSystem).toEqual(
      expect.objectContaining({
        systemAttributes: getSystemAttributesDefaultValues()
      })
    );
    expect(generateHashFromString).toHaveBeenCalledWith(code, undefined);
    expect(generateUrl).toHaveBeenCalledWith([name, "hashed-system-code"]);
  });

  it("should transform system to object without classification features systemattributes", () => {
    const system = createSystem({
      classifications: [
        createSystemAttributesClassification({ features: undefined })
      ]
    });
    const { code, name } = system;
    generateHashFromString.mockReturnValueOnce("hashed-system-code");
    generateUrl.mockReturnValueOnce("generated-url");

    const transformedSystem = transformSystem(system);

    expect(transformedSystem).toEqual(
      expect.objectContaining({
        systemAttributes: []
      })
    );
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

export const createSystemAttributesClassification = (
  classification?: Partial<Classification>
): Classification =>
  createClassification({
    features: [
      createFeature({
        code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/systemAttributes.roofBuildUp`,
        name: "Roof build-up",
        featureValues: [
          createFeatureValue({
            value:
              "Combines self-adhesive/heat activated and torch applied installation techniques"
          })
        ]
      })
    ],
    ...classification,
    code: "systemAttributes"
  });

const getSystemAttributesDefaultValues = () => {
  return [
    {
      code: "bmiClassificationCatalog/1.0/systemAttributes.roofBuildUp",
      name: "Roof build-up",
      values: [
        "Combines self-adhesive/heat activated and torch applied installation techniques"
      ]
    }
  ];
};
