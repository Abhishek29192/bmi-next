import {
  createClassification,
  createFeature,
  createFeatureUnit,
  createFeatureValue
} from "@bmi/pim-types";
import { getBattenSpacings } from "../battenSpacingHelpers";

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

describe("getBattenSpacings", () => {
  it("returns undefined there is no 'tilesAttributes' classification", () => {
    const classifications = [
      createClassification({ code: "fake-classification-code" })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("returns undefined if tilesAttributes.features === []'", () => {
    const classifications = [
      createClassification({ code: "tilesAttributes", features: [] })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("returns undefined if tilesAttributes.features === undefined'", () => {
    const classifications = [
      createClassification({ code: "tilesAttributes", features: undefined })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("returns an array of batten spacings if the needed data provided", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "20" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "25" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "10" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch2Min`,
            featureValues: [createFeatureValue({ value: "20" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch2Max`,
            featureValues: [createFeatureValue({ value: "25" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance2`,
            featureValues: [createFeatureValue({ value: "27" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance2`,
            featureValues: [createFeatureValue({ value: "11" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch3Min`,
            featureValues: [createFeatureValue({ value: "25" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch3Max`,
            featureValues: [createFeatureValue({ value: "30" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance3`,
            featureValues: [createFeatureValue({ value: "29" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance3`,
            featureValues: [createFeatureValue({ value: "12" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch4Min`,
            featureValues: [createFeatureValue({ value: "30" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch4Max`,
            featureValues: [createFeatureValue({ value: "35" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance4`,
            featureValues: [createFeatureValue({ value: "31" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance4`,
            featureValues: [createFeatureValue({ value: "14" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch5Min`,
            featureValues: [createFeatureValue({ value: "35" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch5Max`,
            featureValues: [createFeatureValue({ value: "40" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance5`,
            featureValues: [createFeatureValue({ value: "33" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance5`,
            featureValues: [createFeatureValue({ value: "15" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch6Min`,
            featureValues: [createFeatureValue({ value: "40" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch6Max`,
            featureValues: [createFeatureValue({ value: "45" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance6`,
            featureValues: [createFeatureValue({ value: "35" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance6`,
            featureValues: [createFeatureValue({ value: "16" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toEqual([
      {
        minAngle: 15,
        maxAngle: 20,
        battenDistance: { value: 25, unit: "cm" },
        firstRowBattenDistance: { value: 10, unit: "cm" }
      },
      {
        minAngle: 20,
        maxAngle: 25,
        battenDistance: { value: 27, unit: "cm" },
        firstRowBattenDistance: { value: 11, unit: "cm" }
      },
      {
        minAngle: 25,
        maxAngle: 30,
        battenDistance: { value: 29, unit: "cm" },
        firstRowBattenDistance: { value: 12, unit: "cm" }
      },
      {
        minAngle: 30,
        maxAngle: 35,
        battenDistance: { value: 31, unit: "cm" },
        firstRowBattenDistance: { value: 14, unit: "cm" }
      },
      {
        minAngle: 35,
        maxAngle: 40,
        battenDistance: { value: 33, unit: "cm" },
        firstRowBattenDistance: { value: 15, unit: "cm" }
      },
      {
        minAngle: 40,
        maxAngle: 45,
        battenDistance: { value: 35, unit: "cm" },
        firstRowBattenDistance: { value: 16, unit: "cm" }
      }
    ]);
  });

  it("ignores batten spacing if tilesAttributes.roofPitch*Min field does not exist", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "20" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "25" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "10" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("ignores batten spacing if tilesAttributes.roofPitch*Min is non numeric", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "fake value" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "20" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "25" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "10" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("ignores batten spacing if tilesAttributes.roofPitch*Max field does not exist", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "25" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "10" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("ignores batten spacing if tilesAttributes.roofPitch*Max is non numeric", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "fake value" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "25" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "10" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("ignores batten spacing if tilesAttributes.MaxBattenDistance* field does not exist", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "10" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("ignores batten spacing if tilesAttributes.MaxBattenDistance* is non numeric", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "20" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "fake value" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "10" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("ignores batten spacing if tilesAttributes.MaxBattenDistance* field does not have 'featureUnit' field", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "20" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "25" })],
            featureUnit: undefined
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "10" })],
            featureUnit: createFeatureUnit({ symbol: "mm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("ignores batten spacing if tilesAttributes.FirstRowBattenDistance* field does not exist", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "25" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("ignores batten spacing if tilesAttributes.FirstRowBattenDistance* is non numberic", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "25" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "fake value" })],
            featureUnit: createFeatureUnit({ symbol: "mm" })
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });

  it("ignores batten spacing if tilesAttributes.FirstRowBattenDistance* does not have 'featureUnit' field", () => {
    const classifications = [
      createClassification({
        code: "tilesAttributes",
        features: [
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
            featureValues: [createFeatureValue({ value: "15" })]
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
            featureValues: [createFeatureValue({ value: "25" })],
            featureUnit: createFeatureUnit({ symbol: "cm" })
          }),
          createFeature({
            code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
            featureValues: [createFeatureValue({ value: "10" })],
            featureUnit: undefined
          })
        ]
      })
    ];
    const result = getBattenSpacings(classifications);
    expect(result).toBeUndefined();
  });
});
