import { ProductReference } from "@bmi/elasticsearch-types";
import { ProductType } from "../types/v2";

const sharedESRules = [
  { match: { "CHANNEL.code": "CALCULATOR" } },
  { exists: { field: "externalProductCode" } },
  { exists: { field: "name" } }
];

export const getProductsQuery = (pitches: number[]) => ({
  size: 100,
  query: {
    bool: {
      should: [
        {
          bool: {
            must: [
              ...sharedESRules,
              {
                match: {
                  "GENERALINFORMATION.PRODUCTTYPE.code": ProductType.tile
                }
              },
              { exists: { field: "MEASUREMENTS.WIDTH" } },
              { exists: { field: "MEASUREMENTS.HEIGHT" } },
              { exists: { field: "TILESATTRIBUTES.MINIMUMBATTENSPACING" } },
              { exists: { field: "TILESATTRIBUTES.MAXIMUMBATTENSPACING" } },
              { exists: { field: "TILESATTRIBUTES.RIDGESPACE" } },
              { exists: { field: "TILESATTRIBUTES.EAVEGAUGE" } },
              { exists: { field: "GENERALINFORMATION.CLASSIFICATION" } },
              { exists: { field: "APPEARANCEATTRIBUTES.COLOUR" } }
            ],
            filter: pitches.flatMap((pitchValue) => [
              {
                range: {
                  "TILESATTRIBUTES.EAVEGAUGEENDANGLE.value": {
                    gte: pitchValue,
                    lt: 90
                  }
                }
              },
              {
                range: {
                  "TILESATTRIBUTES.EAVEGAUGESTARTANGLE.value": {
                    lte: pitchValue
                  }
                }
              },
              {
                range: {
                  "TILESATTRIBUTES.MAXGAUGEENDANGLE.value": {
                    gte: pitchValue,
                    lt: 90
                  }
                }
              },
              {
                range: {
                  "TILESATTRIBUTES.MAXGAUGESTARTANGLE.value": {
                    lte: pitchValue
                  }
                }
              },
              {
                range: {
                  "TILESATTRIBUTES.RIDGESPACEENDANGLE.value": {
                    gte: pitchValue,
                    lt: 90
                  }
                }
              },
              {
                range: {
                  "TILESATTRIBUTES.RIDGESPACESTARTANGLE.value": {
                    lte: pitchValue
                  }
                }
              }
            ])
          }
        },
        {
          bool: {
            must: [
              ...sharedESRules,
              {
                match: {
                  "GENERALINFORMATION.PRODUCTTYPE.code": ProductType.underlay
                }
              },
              { exists: { field: "MEASUREMENTS.WIDTH" } },
              { exists: { field: "MEASUREMENTS.LENGTH" } },
              { exists: { field: "UNDERLAYATTRIBUTES.OVERLAP" } }
            ],
            filter: pitches.map((pitch) => ({
              range: {
                "UNDERLAYATTRIBUTES.MINSUPPORTEDPITCH.value": {
                  lte: pitch
                }
              }
            }))
          }
        },
        {
          bool: {
            must: [
              ...sharedESRules,
              {
                terms: {
                  "GENERALINFORMATION.PRODUCTTYPE.code.keyword": [
                    ProductType.gutter,
                    ProductType.gutterHook
                  ]
                }
              },
              { exists: { field: "MEASUREMENTS.LENGTH" } }
            ]
          }
        }
      ]
    }
  }
});

export const constructQueryForProductReferences = (
  productReferences: ProductReference[]
) => ({
  size: 50,
  query: {
    bool: {
      must: [
        {
          terms: {
            "code.keyword": productReferences.map(
              (productReference) => productReference.code
            )
          }
        },
        { exists: { field: "externalProductCode" } },
        { exists: { field: "name" } }
      ]
    }
  }
});
