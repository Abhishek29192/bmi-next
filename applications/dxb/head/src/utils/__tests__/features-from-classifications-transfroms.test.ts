import {
  ClassificationCodeEnum,
  FeatureCodeEnum
} from "../../components/types/pim";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";
import {
  AttributeCodeMap,
  extractFeatureValuesByClassification,
  getClassificationFeaturesByFeatureCodes
} from "../features-from-classifications-transfroms";

describe("getClassificationFeaturesByFeatureCodes tests", () => {
  it("get features by features codes from classifications array", () => {
    const colourFeature = createFeature({
      code: FeatureCodeEnum.COLOUR,
      featureValues: [{ code: "RED", value: "red" }]
    });
    const textureFamilyFeature = createFeature({
      code: FeatureCodeEnum.TEXTURE_FAMILY,
      featureValues: [{ code: "SMOOTH", value: "smooth" }]
    });
    const materialsFeature = createFeature({
      code: FeatureCodeEnum.MATERIALS,
      featureValues: [{ code: "OVERFLATE", value: "over**flate" }]
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: [materialsFeature]
      }),
      createClassification({
        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        features: [colourFeature, textureFamilyFeature]
      })
    ];
    const attributeCodeMap = {
      generalInformation: [{ attrName: FeatureCodeEnum.MATERIALS }],
      appearanceAttributes: [
        { attrName: FeatureCodeEnum.COLOUR },
        { attrName: FeatureCodeEnum.TEXTURE_FAMILY }
      ]
    };
    const expectedResult = {
      [FeatureCodeEnum.COLOUR]: colourFeature,
      [FeatureCodeEnum.TEXTURE_FAMILY]: textureFamilyFeature,
      [FeatureCodeEnum.MATERIALS]: materialsFeature
    };
    const result = getClassificationFeaturesByFeatureCodes(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features by features codes from empty classifications array", () => {
    const classifications = [];
    const attributeCodeMap = {
      generalInformation: [{ attrName: FeatureCodeEnum.MATERIALS }],
      appearanceAttributes: [
        { attrName: FeatureCodeEnum.COLOUR },
        { attrName: FeatureCodeEnum.TEXTURE_FAMILY }
      ]
    };
    const expectedResult = {};
    const result = getClassificationFeaturesByFeatureCodes(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features by features codes from classifications array by empty attributeCodeMap", () => {
    const colourFeature = createFeature({
      code: FeatureCodeEnum.COLOUR,
      featureValues: [{ code: "RED", value: "red" }]
    });
    const textureFamilyFeature = createFeature({
      code: FeatureCodeEnum.TEXTURE_FAMILY,
      featureValues: [{ code: "SMOOTH", value: "smooth" }]
    });
    const materialsFeature = createFeature({
      code: FeatureCodeEnum.MATERIALS,
      featureValues: [{ code: "OVERFLATE", value: "over**flate" }]
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: [materialsFeature]
      }),
      createClassification({
        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        features: [colourFeature, textureFamilyFeature]
      })
    ];
    const attributeCodeMap = {};
    const expectedResult = {};
    const result = getClassificationFeaturesByFeatureCodes(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features by features codes from empty classifications array and empty attributeCodeMap", () => {
    const classifications = [];
    const attributeCodeMap = {};
    const expectedResult = {};
    const result = getClassificationFeaturesByFeatureCodes(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features by features codes from classifications array from empty featureValues arrays", () => {
    const textureFamilyFeature = createFeature({
      code: FeatureCodeEnum.TEXTURE_FAMILY,
      featureValues: []
    });
    const materialsFeature = createFeature({
      code: FeatureCodeEnum.MATERIALS,
      featureValues: [{ code: "OVERFLATE", value: "over**flate" }]
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: [materialsFeature]
      }),
      createClassification({
        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        features: [textureFamilyFeature]
      })
    ];
    const attributeCodeMap = {
      generalInformation: [{ attrName: FeatureCodeEnum.MATERIALS }],
      appearanceAttributes: [
        { attrName: FeatureCodeEnum.COLOUR },
        { attrName: FeatureCodeEnum.TEXTURE_FAMILY }
      ]
    };
    const expectedResult = {
      [FeatureCodeEnum.MATERIALS]: materialsFeature,
      [FeatureCodeEnum.TEXTURE_FAMILY]: textureFamilyFeature
    };
    const result = getClassificationFeaturesByFeatureCodes(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features by features codes from classifications array from empty featureUnits arrays", () => {
    const textureFamilyFeature = createFeature({
      code: FeatureCodeEnum.TEXTURE_FAMILY,
      featureUnit: null
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: []
      }),
      createClassification({
        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        features: [textureFamilyFeature]
      })
    ];
    const attributeCodeMap = {
      generalInformation: [{ attrName: FeatureCodeEnum.MATERIALS }],
      appearanceAttributes: [
        { attrName: FeatureCodeEnum.COLOUR },
        { attrName: FeatureCodeEnum.TEXTURE_FAMILY }
      ]
    };
    const expectedResult = {
      [FeatureCodeEnum.TEXTURE_FAMILY]: textureFamilyFeature
    };
    const result = getClassificationFeaturesByFeatureCodes(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
});

describe("extractFeatureValuesByClassification tests", () => {
  it("get features values strings array by features codes from classifications array", () => {
    const colourFeature = createFeature({
      code: FeatureCodeEnum.COLOUR,
      featureValues: [{ code: "RED", value: "red" }]
    });
    const textureFamilyFeature = createFeature({
      code: FeatureCodeEnum.TEXTURE_FAMILY,
      featureValues: [{ code: "SMOOTH", value: "smooth" }]
    });
    const materialsFeature = createFeature({
      code: FeatureCodeEnum.MATERIALS,
      featureValues: [{ code: "OVERFLATE", value: "over**flate" }]
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: [materialsFeature]
      }),
      createClassification({
        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        features: [colourFeature, textureFamilyFeature]
      })
    ];
    const attributeCodeMap = {
      generalInformation: [{ attrName: FeatureCodeEnum.MATERIALS }],
      appearanceAttributes: [
        { attrName: FeatureCodeEnum.COLOUR },
        { attrName: FeatureCodeEnum.TEXTURE_FAMILY }
      ]
    };
    const expectedResult = ["over**flate", "red", "smooth"];
    const result = extractFeatureValuesByClassification(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features values strings array by features codes from classifications array with empty features array", () => {
    const materialsFeature = createFeature({
      code: FeatureCodeEnum.MATERIALS,
      featureValues: [{ code: "OVERFLATE", value: "over**flate" }]
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: [materialsFeature]
      }),
      createClassification({
        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
        features: []
      })
    ];
    const attributeCodeMap = {
      generalInformation: [{ attrName: FeatureCodeEnum.MATERIALS }],
      appearanceAttributes: [
        { attrName: FeatureCodeEnum.COLOUR },
        { attrName: FeatureCodeEnum.TEXTURE_FAMILY }
      ]
    };
    const expectedResult = ["over**flate"];
    const result = extractFeatureValuesByClassification(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features values strings array by features codes from classifications array with separator", () => {
    const heightFeature = createFeature({
      code: FeatureCodeEnum.HEIGHT,
      featureValues: [{ code: "height", value: "21" }]
    });
    const widthFeature = createFeature({
      code: FeatureCodeEnum.WIDTH,
      featureValues: [{ code: "width", value: "57" }]
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: [heightFeature, widthFeature]
      })
    ];
    const attributeCodeMap: AttributeCodeMap = {
      generalInformation: [
        { attrName: FeatureCodeEnum.HEIGHT, separator: "?" },
        { attrName: FeatureCodeEnum.WIDTH, separator: "*" }
      ]
    };
    const expectedResult = ["21?57*"];
    const result = extractFeatureValuesByClassification(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features values strings array by features codes from classifications array with separator fromStart", () => {
    const heightFeature = createFeature({
      code: FeatureCodeEnum.HEIGHT,
      featureValues: [{ code: "height", value: "21" }]
    });
    const widthFeature = createFeature({
      code: FeatureCodeEnum.WIDTH,
      featureValues: [{ code: "width", value: "57" }]
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: [heightFeature, widthFeature]
      })
    ];
    const attributeCodeMap: AttributeCodeMap = {
      generalInformation: [
        { attrName: FeatureCodeEnum.HEIGHT, separator: "?", fromStart: true },
        { attrName: FeatureCodeEnum.WIDTH, separator: "*" }
      ]
    };
    const expectedResult = ["?2157*"];
    const result = extractFeatureValuesByClassification(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features values strings array by features codes from classifications array without separator", () => {
    const heightFeature = createFeature({
      code: FeatureCodeEnum.HEIGHT,
      featureValues: [{ code: "height", value: "21" }]
    });
    const widthFeature = createFeature({
      code: FeatureCodeEnum.WIDTH,
      featureValues: [{ code: "width", value: "57" }]
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: [heightFeature, widthFeature]
      })
    ];
    const attributeCodeMap: AttributeCodeMap = {
      generalInformation: [
        { attrName: FeatureCodeEnum.HEIGHT },
        { attrName: FeatureCodeEnum.WIDTH }
      ]
    };
    const expectedResult = ["21", "57"];
    const result = extractFeatureValuesByClassification(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
  it("get features values strings array by features codes from classifications array without featureValue", () => {
    const heightFeature = createFeature({
      code: FeatureCodeEnum.HEIGHT,
      featureValues: [{ code: "height", value: "21" }]
    });
    const widthFeature = createFeature({
      code: FeatureCodeEnum.WIDTH,
      featureValues: [{ code: "width", value: undefined }]
    });
    const classifications = [
      createClassification({
        code: ClassificationCodeEnum.GENERAL_INFORMATION,
        name: ClassificationCodeEnum.GENERAL_INFORMATION,
        features: [heightFeature, widthFeature]
      })
    ];
    const attributeCodeMap: AttributeCodeMap = {
      generalInformation: [
        { attrName: FeatureCodeEnum.HEIGHT },
        { attrName: FeatureCodeEnum.WIDTH }
      ]
    };
    const expectedResult = ["21"];
    const result = extractFeatureValuesByClassification(
      classifications,
      attributeCodeMap
    );

    expect(result).toEqual(expectedResult);
  });
});
