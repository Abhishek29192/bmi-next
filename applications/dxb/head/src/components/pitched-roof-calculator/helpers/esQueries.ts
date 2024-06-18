import { ProductReference } from "@bmi/elasticsearch-types";
import { ProductType } from "../types";

const sharedESRules = [
  { match: { "CHANNEL.code": "CALCULATOR" } },
  { exists: { field: "externalProductCode" } },
  { exists: { field: "name" } }
];

export const getTileFilters = (pitches: number[]) => {
  const minPitch = Math.min(...pitches);
  const maxPitch = Math.max(...pitches);

  return {
    must: [
      ...sharedESRules,
      {
        match: {
          "GENERALINFORMATION$PRODUCTTYPE.code": ProductType.tile
        }
      },
      { exists: { field: "MEASUREMENTS$LENGTH" } },
      { exists: { field: "TILESATTRIBUTES$MINIMUMBATTENSPACING" } },
      { exists: { field: "TILESATTRIBUTES$RIDGESPACE" } },
      { exists: { field: "TILESATTRIBUTES$AVERAGEDECKWIDTH" } },
      { exists: { field: "GENERALINFORMATION$MATERIALS" } },
      { exists: { field: "APPEARANCEATTRIBUTES$COLOUR" } }
    ],
    filter: [
      {
        range: {
          "battenSpacings.maxAngle": {
            gte: maxPitch
          }
        }
      },
      {
        range: {
          "battenSpacings.minAngle": {
            lte: minPitch
          }
        }
      },
      {
        range: {
          "TILESATTRIBUTES$RIDGESPACEENDANGLE.value": {
            gte: maxPitch
          }
        }
      },
      {
        range: {
          "TILESATTRIBUTES$RIDGESPACESTARTANGLE.value": {
            lte: minPitch
          }
        }
      }
    ]
  };
};

export const getProductsQuery = (pitches: number[], tileMaterial: string) => {
  const tileFilters = getTileFilters(pitches);
  return {
    size: 100,
    query: {
      bool: {
        should: [
          {
            bool: {
              must: [
                ...tileFilters.must,
                {
                  match: {
                    "GENERALINFORMATION$MATERIALS.name.keyword": tileMaterial
                  }
                }
              ],
              filter: tileFilters.filter
            }
          },
          {
            bool: {
              must: [
                ...sharedESRules,
                {
                  match: {
                    "GENERALINFORMATION$PRODUCTTYPE.code": ProductType.underlay
                  }
                },
                { exists: { field: "MEASUREMENTS$WIDTH" } },
                { exists: { field: "MEASUREMENTS$LENGTH" } },
                { exists: { field: "UNDERLAYATTRIBUTES$OVERLAP" } }
              ],
              filter: [
                {
                  range: {
                    "UNDERLAYATTRIBUTES$MINSUPPORTEDPITCH.value": {
                      lte: Math.min(...pitches)
                    }
                  }
                }
              ]
            }
          },
          { ...guttersEsQuery }
        ]
      }
    }
  };
};

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

const guttersEsQuery = {
  bool: {
    must: [
      ...sharedESRules,
      {
        terms: {
          "GENERALINFORMATION$PRODUCTTYPE.code.keyword": [
            ProductType.gutter,
            ProductType.gutterHook
          ]
        }
      },
      { exists: { field: "MEASUREMENTS$LENGTH" } }
    ]
  }
};
