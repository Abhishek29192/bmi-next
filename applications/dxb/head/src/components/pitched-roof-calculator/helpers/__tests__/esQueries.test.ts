import { getProductsQuery, getTileFilters } from "../esQueries";

describe("getTileFilters", () => {
  it("returns correct tiles query if only one pitch provided", () => {
    expect(getTileFilters([10])).toEqual({
      filter: [
        {
          range: {
            "battenSpacings.maxAngle": {
              gte: 10
            }
          }
        },
        {
          range: {
            "battenSpacings.minAngle": {
              lte: 10
            }
          }
        },
        {
          range: {
            "TILESATTRIBUTES$RIDGESPACEENDANGLE.value": {
              gte: 10
            }
          }
        },
        {
          range: {
            "TILESATTRIBUTES$RIDGESPACESTARTANGLE.value": {
              lte: 10
            }
          }
        }
      ],
      must: [
        {
          match: {
            "CHANNEL.code": "CALCULATOR"
          }
        },
        {
          exists: {
            field: "externalProductCode"
          }
        },
        {
          exists: {
            field: "name"
          }
        },
        {
          match: {
            "GENERALINFORMATION$PRODUCTTYPE.code": "MAIN_TILE"
          }
        },
        {
          exists: {
            field: "MEASUREMENTS$LENGTH"
          }
        },
        {
          exists: {
            field: "TILESATTRIBUTES$MINIMUMBATTENSPACING"
          }
        },
        {
          exists: {
            field: "TILESATTRIBUTES$RIDGESPACE"
          }
        },
        {
          exists: {
            field: "TILESATTRIBUTES$AVERAGEDECKWIDTH"
          }
        },
        {
          exists: {
            field: "GENERALINFORMATION$MATERIALS"
          }
        },
        {
          exists: {
            field: "APPEARANCEATTRIBUTES$COLOUR"
          }
        }
      ]
    });
  });

  it("returns correct tiles query if multiple pitches provided", () => {
    expect(getTileFilters([30, 15])).toEqual({
      filter: [
        {
          range: {
            "battenSpacings.maxAngle": {
              gte: 30
            }
          }
        },
        {
          range: {
            "battenSpacings.minAngle": {
              lte: 15
            }
          }
        },
        {
          range: {
            "TILESATTRIBUTES$RIDGESPACEENDANGLE.value": {
              gte: 30
            }
          }
        },
        {
          range: {
            "TILESATTRIBUTES$RIDGESPACESTARTANGLE.value": {
              lte: 15
            }
          }
        }
      ],
      must: [
        {
          match: {
            "CHANNEL.code": "CALCULATOR"
          }
        },
        {
          exists: {
            field: "externalProductCode"
          }
        },
        {
          exists: {
            field: "name"
          }
        },
        {
          match: {
            "GENERALINFORMATION$PRODUCTTYPE.code": "MAIN_TILE"
          }
        },
        {
          exists: {
            field: "MEASUREMENTS$LENGTH"
          }
        },
        {
          exists: {
            field: "TILESATTRIBUTES$MINIMUMBATTENSPACING"
          }
        },
        {
          exists: {
            field: "TILESATTRIBUTES$RIDGESPACE"
          }
        },
        {
          exists: {
            field: "TILESATTRIBUTES$AVERAGEDECKWIDTH"
          }
        },
        {
          exists: {
            field: "GENERALINFORMATION$MATERIALS"
          }
        },
        {
          exists: {
            field: "APPEARANCEATTRIBUTES$COLOUR"
          }
        }
      ]
    });
  });
});

describe("getProductsQuery", () => {
  it("returns correct query if one pitch value provided", () => {
    expect(getProductsQuery([10], "Clay")).toEqual({
      query: {
        bool: {
          should: [
            {
              bool: {
                filter: [
                  {
                    range: {
                      "battenSpacings.maxAngle": {
                        gte: 10
                      }
                    }
                  },
                  {
                    range: {
                      "battenSpacings.minAngle": {
                        lte: 10
                      }
                    }
                  },
                  {
                    range: {
                      "TILESATTRIBUTES$RIDGESPACEENDANGLE.value": {
                        gte: 10
                      }
                    }
                  },
                  {
                    range: {
                      "TILESATTRIBUTES$RIDGESPACESTARTANGLE.value": {
                        lte: 10
                      }
                    }
                  }
                ],
                must: [
                  {
                    match: {
                      "CHANNEL.code": "CALCULATOR"
                    }
                  },
                  {
                    exists: {
                      field: "externalProductCode"
                    }
                  },
                  {
                    exists: {
                      field: "name"
                    }
                  },
                  {
                    match: {
                      "GENERALINFORMATION$PRODUCTTYPE.code": "MAIN_TILE"
                    }
                  },
                  {
                    exists: {
                      field: "MEASUREMENTS$LENGTH"
                    }
                  },
                  {
                    exists: {
                      field: "TILESATTRIBUTES$MINIMUMBATTENSPACING"
                    }
                  },
                  {
                    exists: {
                      field: "TILESATTRIBUTES$RIDGESPACE"
                    }
                  },
                  {
                    exists: {
                      field: "TILESATTRIBUTES$AVERAGEDECKWIDTH"
                    }
                  },
                  {
                    exists: {
                      field: "GENERALINFORMATION$MATERIALS"
                    }
                  },
                  {
                    exists: {
                      field: "APPEARANCEATTRIBUTES$COLOUR"
                    }
                  },
                  {
                    match: {
                      "GENERALINFORMATION$MATERIALS.name.keyword": "Clay"
                    }
                  }
                ]
              }
            },
            {
              bool: {
                filter: [
                  {
                    range: {
                      "UNDERLAYATTRIBUTES$MINSUPPORTEDPITCH.value": {
                        lte: 10
                      }
                    }
                  }
                ],
                must: [
                  {
                    match: {
                      "CHANNEL.code": "CALCULATOR"
                    }
                  },
                  {
                    exists: {
                      field: "externalProductCode"
                    }
                  },
                  {
                    exists: {
                      field: "name"
                    }
                  },
                  {
                    match: {
                      "GENERALINFORMATION$PRODUCTTYPE.code": "UNDERLAY"
                    }
                  },
                  {
                    exists: {
                      field: "MEASUREMENTS$WIDTH"
                    }
                  },
                  {
                    exists: {
                      field: "MEASUREMENTS$LENGTH"
                    }
                  },
                  {
                    exists: {
                      field: "UNDERLAYATTRIBUTES$OVERLAP"
                    }
                  }
                ]
              }
            },
            {
              bool: {
                must: [
                  {
                    match: {
                      "CHANNEL.code": "CALCULATOR"
                    }
                  },
                  {
                    exists: {
                      field: "externalProductCode"
                    }
                  },
                  {
                    exists: {
                      field: "name"
                    }
                  },
                  {
                    terms: {
                      "GENERALINFORMATION$PRODUCTTYPE.code.keyword": [
                        "GUTTER",
                        "GUTTER_HOOK"
                      ]
                    }
                  },
                  {
                    exists: {
                      field: "MEASUREMENTS$LENGTH"
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      size: 100
    });
  });

  it("returns correct query if multiple pitch values provided", () => {
    expect(getProductsQuery([30, 15], "Clay")).toEqual({
      query: {
        bool: {
          should: [
            {
              bool: {
                filter: [
                  {
                    range: {
                      "battenSpacings.maxAngle": {
                        gte: 30
                      }
                    }
                  },
                  {
                    range: {
                      "battenSpacings.minAngle": {
                        lte: 15
                      }
                    }
                  },
                  {
                    range: {
                      "TILESATTRIBUTES$RIDGESPACEENDANGLE.value": {
                        gte: 30
                      }
                    }
                  },
                  {
                    range: {
                      "TILESATTRIBUTES$RIDGESPACESTARTANGLE.value": {
                        lte: 15
                      }
                    }
                  }
                ],
                must: [
                  {
                    match: {
                      "CHANNEL.code": "CALCULATOR"
                    }
                  },
                  {
                    exists: {
                      field: "externalProductCode"
                    }
                  },
                  {
                    exists: {
                      field: "name"
                    }
                  },
                  {
                    match: {
                      "GENERALINFORMATION$PRODUCTTYPE.code": "MAIN_TILE"
                    }
                  },
                  {
                    exists: {
                      field: "MEASUREMENTS$LENGTH"
                    }
                  },
                  {
                    exists: {
                      field: "TILESATTRIBUTES$MINIMUMBATTENSPACING"
                    }
                  },
                  {
                    exists: {
                      field: "TILESATTRIBUTES$RIDGESPACE"
                    }
                  },
                  {
                    exists: {
                      field: "TILESATTRIBUTES$AVERAGEDECKWIDTH"
                    }
                  },
                  {
                    exists: {
                      field: "GENERALINFORMATION$MATERIALS"
                    }
                  },
                  {
                    exists: {
                      field: "APPEARANCEATTRIBUTES$COLOUR"
                    }
                  },
                  {
                    match: {
                      "GENERALINFORMATION$MATERIALS.name.keyword": "Clay"
                    }
                  }
                ]
              }
            },
            {
              bool: {
                filter: [
                  {
                    range: {
                      "UNDERLAYATTRIBUTES$MINSUPPORTEDPITCH.value": {
                        lte: 15
                      }
                    }
                  }
                ],
                must: [
                  {
                    match: {
                      "CHANNEL.code": "CALCULATOR"
                    }
                  },
                  {
                    exists: {
                      field: "externalProductCode"
                    }
                  },
                  {
                    exists: {
                      field: "name"
                    }
                  },
                  {
                    match: {
                      "GENERALINFORMATION$PRODUCTTYPE.code": "UNDERLAY"
                    }
                  },
                  {
                    exists: {
                      field: "MEASUREMENTS$WIDTH"
                    }
                  },
                  {
                    exists: {
                      field: "MEASUREMENTS$LENGTH"
                    }
                  },
                  {
                    exists: {
                      field: "UNDERLAYATTRIBUTES$OVERLAP"
                    }
                  }
                ]
              }
            },
            {
              bool: {
                must: [
                  {
                    match: {
                      "CHANNEL.code": "CALCULATOR"
                    }
                  },
                  {
                    exists: {
                      field: "externalProductCode"
                    }
                  },
                  {
                    exists: {
                      field: "name"
                    }
                  },
                  {
                    terms: {
                      "GENERALINFORMATION$PRODUCTTYPE.code.keyword": [
                        "GUTTER",
                        "GUTTER_HOOK"
                      ]
                    }
                  },
                  {
                    exists: {
                      field: "MEASUREMENTS$LENGTH"
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      size: 100
    });
  });
});
