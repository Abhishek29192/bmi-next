import {
  Classification,
  createClassification,
  createFeature,
  createFeatureUnit,
  createFeatureValue,
  createImage,
  createMeasurementsClassification,
  createProduct as createPimProduct,
  createVariantOption,
  Image
} from "@bmi/pim-types";
import mockConsole from "jest-mock-console";
import {
  ESIndexObject,
  findMainImage,
  generateSubtitleValues,
  getSizeLabel,
  groupBy,
  IndexedItemGroup,
  indexFeatures,
  mapProductClassifications
} from "../CLONE";
import { createTwoOneClassifications } from "./helpers/TwoOneHelper";

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

beforeAll(() => {
  mockConsole();
});

type ImageItem = {
  name: string;
  type: "jpg" | "gif" | "svg";
  brand: string;
};

describe("CLONE tests", () => {
  describe("getSizeLabel tests", () => {
    describe("when empty object is provided", () => {
      it("should return empty string", () => {
        expect(getSizeLabel({})).toEqual("");
      });
    });
    describe("when withUnit is true tests", () => {
      describe("when object with single measurement attribute is provided", () => {
        it("should return single measurement with its unit", () => {
          expect(
            getSizeLabel({
              height: {
                name: "height",
                value: {
                  value: { value: "5" },
                  unit: "mm"
                }
              }
            })
          ).toEqual("5mm");
        });
      });
      describe("when object with multiple measurement attributes with single unit are provided", () => {
        it("should return multiple measurements with same unit", () => {
          expect(
            getSizeLabel({
              height: {
                name: "height",
                value: {
                  value: { value: "5" },
                  unit: "mm"
                }
              },
              width: {
                name: "width",
                value: {
                  value: { value: "5" },
                  unit: "mm"
                }
              }
            })
          ).toEqual("5x5mm");
        });
      });

      describe("when object with multiple measurement attributes with multiple unit are provided", () => {
        it("should return multiple measurements with differnt unit", () => {
          expect(
            getSizeLabel({
              height: {
                name: "height",
                value: {
                  value: { value: "5" },
                  unit: "mm"
                }
              },
              width: {
                name: "width",
                value: {
                  value: { value: "5" },
                  unit: "cm"
                }
              }
            })
          ).toEqual("5mm x 5cm");
        });
      });
    });

    it("should return empty object if product.variantOptions.classifications.features === undefined", () => {
      const product = createPimProduct({
        classifications: [],
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: undefined
              })
            ]
          })
        ]
      });

      const mapedProductClassifications = mapProductClassifications(
        product,
        PIM_CLASSIFICATION_CATALOGUE_NAMESPACE!
      );
      expect(mapedProductClassifications).toEqual({});
    });

    it("should return correct object if product.variantOptions.classifications.features.featureValues === undefined", () => {
      const product = createPimProduct({
        classifications: [],
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    name: "feature",
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.length`,
                    featureValues: undefined,
                    featureUnit: createFeatureUnit()
                  })
                ]
              })
            ]
          })
        ]
      });
      const mapedProductClassifications = mapProductClassifications(
        product,
        PIM_CLASSIFICATION_CATALOGUE_NAMESPACE!
      );

      const expectedObj = {
        "variant-code": {
          measurements: {
            length: {
              name: "feature",
              value: {
                unit: "symbol",
                value: "n/a"
              }
            }
          }
        }
      };

      expect(mapedProductClassifications).toEqual(expectedObj);
    });

    it("should return correct object if product.variantOptions.classifications.features.featureUnit === undefined", () => {
      const product = createPimProduct({
        classifications: [],
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    name: "feature",
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.length`,
                    featureValues: [createFeatureValue()],
                    featureUnit: undefined
                  })
                ]
              })
            ]
          })
        ]
      });
      const mapedProductClassifications = mapProductClassifications(
        product,
        PIM_CLASSIFICATION_CATALOGUE_NAMESPACE!
      );

      const expectedObj = {
        "variant-code": {
          measurements: {
            length: {
              name: "feature",
              value: {
                unit: undefined,
                value: {
                  code: "code",
                  value: "value"
                }
              }
            }
          }
        }
      };

      expect(mapedProductClassifications).toEqual(expectedObj);
    });

    describe("when withUnit is false tests", () => {
      describe("when object with single measurement attribute is provided", () => {
        it("should return single measurement without its unit", () => {
          expect(
            getSizeLabel(
              {
                height: {
                  name: "height",
                  value: {
                    value: { value: "5" },
                    unit: "mm"
                  }
                }
              },
              false
            )
          ).toEqual("5");
        });
      });
      describe("when object with multiple measurement attributes with single unit are provided", () => {
        it("should return multiple measurements without unit", () => {
          expect(
            getSizeLabel(
              {
                height: {
                  name: "height",
                  value: {
                    value: { value: "5" },
                    unit: "mm"
                  }
                },
                width: {
                  name: "width",
                  value: {
                    value: { value: "5" },
                    unit: "mm"
                  }
                }
              },
              false
            )
          ).toEqual("5x5");
        });
      });

      describe("when object with multiple measurement attributes with multiple unit are provided", () => {
        it("should return multiple measurements with multiple unit", () => {
          expect(
            getSizeLabel(
              {
                height: {
                  name: "height",
                  value: {
                    value: { value: "5" },
                    unit: "mm"
                  }
                },
                width: {
                  name: "width",
                  value: {
                    value: { value: "5" },
                    unit: "cm"
                  }
                }
              },
              false
            )
          ).toEqual("5mm x 5cm");
        });
      });
    });
  });

  describe("groupBy tests", () => {
    it("should return empty object when empty array is provided", () => {
      expect(groupBy([], "")).toEqual({});
    });
    it("should return empty object when empty array with unknown key is provided", () => {
      expect(groupBy([], "test")).toEqual({});
    });

    describe("typed object tests", () => {
      it("should return images grouped by type", () => {
        const imageGallery: Array<ImageItem> = [
          { name: "image_1", type: "gif", brand: "aerodek" },
          { name: "image_3", type: "gif", brand: "aerodek" },
          { name: "image_4", type: "jpg", brand: "icopal" },
          { name: "image_2", type: "gif", brand: "aerodek" },
          { name: "image_5", type: "jpg", brand: "icopal" },
          { name: "image_6", type: "svg", brand: "aerodek" }
        ];
        const result: IndexedItemGroup<ImageItem> = groupBy(
          imageGallery,
          "type"
        );
        expect(Object.keys(result).length).toEqual(3);
        expect(result["gif"].length).toEqual(3);
        expect(result["jpg"].length).toEqual(2);
        expect(result["svg"].length).toEqual(1);
      });

      it("should return images grouped by brand", () => {
        const imageGallery: Array<ImageItem> = [
          { name: "image_1", type: "gif", brand: "aerodek" },
          { name: "image_3", type: "gif", brand: "aerodek" },
          { name: "image_4", type: "jpg", brand: "icopal" },
          { name: "image_2", type: "gif", brand: "aerodek" },
          { name: "image_5", type: "jpg", brand: "icopal" },
          { name: "image_6", type: "svg", brand: "aerodek" }
        ];
        const result: IndexedItemGroup<ImageItem> = groupBy(
          imageGallery,
          "brand"
        );
        expect(Object.keys(result).length).toEqual(2);
        expect(result["aerodek"].length).toEqual(4);
        expect(result["icopal"].length).toEqual(2);
      });
    });
  });

  describe("IndexFeatures tests", () => {
    it("should return empty object when empty array is passed", () => {
      const result: IndexedItemGroup<ESIndexObject> = indexFeatures("", []);
      expect(result).toEqual({});
    });

    it("should return correct code value if pimClassificationNameSpace populated as undefined", () => {
      const code = "pim-namespace/1.0/feature-code-1";
      const expectedCode = "PIM-NAMESPACE1$0/FEATURE-CODE-1";
      const pimClassificationNameSpace = undefined;
      const classifications: Array<Classification> = [
        createClassification({
          features: [
            createFeature({
              code,
              featureValues: [createFeatureValue()]
            })
          ]
        })
      ];
      const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
        pimClassificationNameSpace,
        classifications
      );
      expect(Object.keys(result)[0]).toEqual(expectedCode);
    });

    it("returns value field only for needed classifications", () => {
      const pimClassificationNameSpace = "bmiClassificationCatalog/1.0";
      const classifications: Array<Classification> = [
        createClassification({
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.eaveGauge",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.eaveGaugeStartAngle",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.eaveGaugeEndAngle",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.maxGaugeStartAngle",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.maxGaugeEndAngle",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.maximumBattenSpacing",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.minimumBattenSpacing",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.ridgeSpace",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.ridgeSpaceStartAngle",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.ridgeSpaceEndAngle",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/underlayAttributes.minSupportedPitch",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/underlayAttributes.overlap",
              featureValues: [createFeatureValue({ value: "1" })]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
              featureValues: [createFeatureValue({ value: "red" })]
            })
          ]
        })
      ];
      const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
        pimClassificationNameSpace,
        classifications
      );
      expect(result["APPEARANCEATTRIBUTES$COLOUR"][0].value).toBeUndefined();
      expect(result["MEASUREMENTS$LENGTH"][0].value).toBe("1");
      expect(result["MEASUREMENTS$WIDTH"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$EAVEGAUGE"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$EAVEGAUGESTARTANGLE"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$EAVEGAUGEENDANGLE"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$MAXGAUGESTARTANGLE"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$MAXGAUGEENDANGLE"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$MAXIMUMBATTENSPACING"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$MINIMUMBATTENSPACING"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$RIDGESPACE"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$RIDGESPACESTARTANGLE"][0].value).toBe("1");
      expect(result["TILESATTRIBUTES$RIDGESPACEENDANGLE"][0].value).toBe("1");
      expect(result["UNDERLAYATTRIBUTES$MINSUPPORTEDPITCH"][0].value).toBe("1");
      expect(result["UNDERLAYATTRIBUTES$OVERLAP"][0].value).toBe("1");
    });

    describe("When single classification with NO features is passed", () => {
      it("should return empty object", () => {
        const classifications: Array<Classification> = [
          createClassification({ features: [] })
        ];
        const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
          "",
          classifications
        );
        expect(result).toEqual({});
      });
    });

    describe("When feature value code is NOT populated", () => {
      describe("When single classification and single feature is passed with PIM classification namespace", () => {
        it("should return indexed object without namespace and code value", () => {
          const classifications: Array<Classification> = [
            createClassification({
              features: [
                createFeature({
                  code: "pim-namespace/1.0/feature-code-1",
                  featureValues: [createFeatureValue({ code: undefined })]
                })
              ]
            })
          ];
          const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
            "pim-namespace/1.0",
            classifications
          );
          expect(result).toEqual({
            "FEATURE-CODE-1": [
              {
                code: "valuesymbol",
                name: "value symbol"
              }
            ]
          });
        });
      });

      describe("When single classification and single feature is passed", () => {
        it("should return indexed object with feature value", () => {
          const classifications: Array<Classification> = [
            createClassification({
              features: [
                createFeature({
                  featureValues: [createFeatureValue({ code: undefined })]
                })
              ]
            })
          ];
          const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
            "",
            classifications
          );
          expect(result).toEqual({
            "CLASSIFICATION-FEATURE-CODE": [
              {
                code: "valuesymbol",
                name: "value symbol"
              }
            ]
          });
        });
      });

      describe("When single classification, single feature with multiple feature values are passed", () => {
        it("should return indexed object with feature value", () => {
          const classifications: Array<Classification> = [
            createClassification({
              features: [
                createFeature({
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "value-1" }),
                    createFeatureValue({ code: undefined, value: "value-2" }),
                    createFeatureValue({ code: undefined, value: "value-3" })
                  ]
                })
              ]
            })
          ];
          const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
            "",
            classifications
          );
          expect(result).toEqual({
            "CLASSIFICATION-FEATURE-CODE": [
              {
                code: "value-1symbol",
                name: "value-1 symbol"
              },
              {
                code: "value-2symbol",
                name: "value-2 symbol"
              },
              {
                code: "value-3symbol",
                name: "value-3 symbol"
              }
            ]
          });
        });
      });

      describe("When multiple classification with multiple features and multiple feature values are passed", () => {
        it("should return multiple features indexed object with feature values", () => {
          const classifications: Array<Classification> = [
            createClassification({
              features: [
                createFeature({
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "value-1" }),
                    createFeatureValue({ code: undefined, value: "value-2" }),
                    createFeatureValue({ code: undefined, value: "value-3" })
                  ]
                })
              ]
            }),
            createClassification({
              code: "classification-2",
              features: [
                createFeature({
                  code: "classification-feature-code-2",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "value-4" }),
                    createFeatureValue({ code: undefined, value: "value-5" }),
                    createFeatureValue({ code: undefined, value: "value-6" })
                  ]
                })
              ]
            })
          ];
          const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
            "",
            classifications
          );
          expect(result).toEqual({
            "CLASSIFICATION-FEATURE-CODE": [
              {
                code: "value-1symbol",
                name: "value-1 symbol"
              },
              {
                code: "value-2symbol",
                name: "value-2 symbol"
              },
              {
                code: "value-3symbol",
                name: "value-3 symbol"
              }
            ],
            "CLASSIFICATION-FEATURE-CODE-2": [
              {
                code: "value-4symbol",
                name: "value-4 symbol"
              },
              {
                code: "value-5symbol",
                name: "value-5 symbol"
              },
              {
                code: "value-6symbol",
                name: "value-6 symbol"
              }
            ]
          });
        });
      });
    });

    describe("When feature value code is populated", () => {
      describe("When single classification and single feature is passed with PIM classification namespace", () => {
        it("should return indexed object without namespace", () => {
          const classifications: Array<Classification> = [
            createClassification({
              features: [
                createFeature({ code: "pim-namespace/1.0/feature-code-1" })
              ]
            })
          ];
          const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
            "pim-namespace/1.0",
            classifications
          );
          expect(result).toEqual({
            "FEATURE-CODE-1": [
              {
                code: "codesymbol",
                name: "value symbol"
              }
            ]
          });
        });
      });

      describe("When single classification and single feature is passed", () => {
        it("should return indexed object with feature code", () => {
          const classifications: Array<Classification> = [
            createClassification()
          ];
          const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
            "",
            classifications
          );
          expect(result).toEqual({
            "CLASSIFICATION-FEATURE-CODE": [
              {
                code: "codesymbol",
                name: "value symbol"
              }
            ]
          });
        });
      });

      describe("When single classification, single feature with multiple feature values are passed", () => {
        it("should return indexed object with feature code", () => {
          const classifications: Array<Classification> = [
            createClassification({
              features: [
                createFeature({
                  featureValues: [
                    createFeatureValue({ code: "code1", value: "value-1" }),
                    createFeatureValue({ code: "code2", value: "value-2" }),
                    createFeatureValue({ code: "code3", value: "value-3" })
                  ]
                })
              ]
            })
          ];
          const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
            "",
            classifications
          );
          expect(result).toEqual({
            "CLASSIFICATION-FEATURE-CODE": [
              {
                code: "code1symbol",
                name: "value-1 symbol"
              },
              {
                code: "code2symbol",
                name: "value-2 symbol"
              },
              {
                code: "code3symbol",
                name: "value-3 symbol"
              }
            ]
          });
        });
      });

      describe("When multiple classification with multiple features and multiple feature values are passed", () => {
        it("should return multiple features indexed object with feature codes", () => {
          const classifications: Array<Classification> = [
            createClassification({
              features: [
                createFeature({
                  featureValues: [
                    createFeatureValue({ code: "code1", value: "value-1" }),
                    createFeatureValue({ code: "code2", value: "value-2" }),
                    createFeatureValue({ code: "code3", value: "value-3" })
                  ]
                })
              ]
            }),
            createClassification({
              code: "classification-2",
              features: [
                createFeature({
                  code: "classification-feature-code-2",
                  featureValues: [
                    createFeatureValue({ code: "code4", value: "value-4" }),
                    createFeatureValue({ code: "code5", value: "value-5" }),
                    createFeatureValue({ code: "code6", value: "value-6" })
                  ]
                })
              ]
            })
          ];
          const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
            "",
            classifications
          );
          expect(result).toEqual({
            "CLASSIFICATION-FEATURE-CODE": [
              {
                code: "code1symbol",
                name: "value-1 symbol"
              },
              {
                code: "code2symbol",
                name: "value-2 symbol"
              },
              {
                code: "code3symbol",
                name: "value-3 symbol"
              }
            ],
            "CLASSIFICATION-FEATURE-CODE-2": [
              {
                code: "code4symbol",
                name: "value-4 symbol"
              },
              {
                code: "code5symbol",
                name: "value-5 symbol"
              },
              {
                code: "code6symbol",
                name: "value-6 symbol"
              }
            ]
          });
        });
      });

      describe("When multiple TwoOne Classifications are present", () => {
        describe("And No features are present", () => {
          it("should return empty features list", () => {
            const classifications: Array<Classification> = [
              createClassification({
                features: undefined
              }),
              createClassification({
                code: "classification-2",
                features: undefined
              })
            ];
            const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
              "",
              classifications
            );
            expect(result).toEqual({});
          });
        });
        describe("And Multiple features are present", () => {
          it("should remove ALL Two One Classifications and matching ignore features", () => {
            const classifications: Array<Classification> = [
              ...createTwoOneClassifications(""),
              createClassification({
                features: [
                  createFeature({
                    featureValues: [
                      createFeatureValue({ code: "code1", value: "value-1" }),
                      createFeatureValue({ code: "code2", value: "value-2" }),
                      createFeatureValue({ code: "code3", value: "value-3" })
                    ]
                  })
                ]
              }),
              createClassification({
                code: "classification-2",
                features: [
                  createFeature({
                    code: "classification-feature-code-2",
                    featureValues: [
                      createFeatureValue({ code: "code4", value: "value-4" }),
                      createFeatureValue({ code: "code5", value: "value-5" }),
                      createFeatureValue({ code: "code6", value: "value-6" })
                    ]
                  })
                ]
              })
            ];
            const result: IndexedItemGroup<ESIndexObject> = indexFeatures(
              "",
              classifications
            );
            expect(result).toEqual({
              "CLASSIFICATION-FEATURE-CODE": [
                {
                  code: "code1symbol",
                  name: "value-1 symbol"
                },
                {
                  code: "code2symbol",
                  name: "value-2 symbol"
                },
                {
                  code: "code3symbol",
                  name: "value-3 symbol"
                }
              ],
              "CLASSIFICATION-FEATURE-CODE-2": [
                {
                  code: "code4symbol",
                  name: "value-4 symbol"
                },
                {
                  code: "code5symbol",
                  name: "value-5 symbol"
                },
                {
                  code: "code6symbol",
                  name: "value-6 symbol"
                }
              ]
            });
          });
        });
      });
    });
  });

  describe("findMainImage tests", () => {
    describe("when Images are empty array", () => {
      it("should return empty string", () => {
        const result = findMainImage([]);

        expect(result).toEqual("");
      });
    });
    describe("when Images are NOT empty array", () => {
      describe("and Hero Desktop Tablet Image format exists", () => {
        it("should return Hero Desktop Tablet Image format url string", () => {
          const expectedUrl = "http://product-hero-small-desktop-tablet.com";
          const images: Image[] = [
            createImage({
              format: "Product-Hero-Small-Desktop-Tablet",
              url: expectedUrl
            })
          ];
          const result = findMainImage(images);

          expect(result).toEqual(expectedUrl);
        });
        describe("and Hero Desktop Tablet Image url is undefined", () => {
          it("should return Hero Desktop Tablet Image format url string", () => {
            const images: Image[] = [
              createImage({
                format: "Product-Hero-Small-Desktop-Tablet",
                url: undefined
              })
            ];
            const result = findMainImage(images);

            expect(result).toEqual("");
          });
        });

        describe("and an Image with Product Color Selector Mobile Url value is populated", () => {
          it("should return main source using desktop tabled url as string", () => {
            const expectedUrl = "http://product-hero-small-desktop-tablet.com";
            const images: Image[] = [
              createImage({
                format: "Product-Color-Selector-Mobile",
                url: "http://product-color-selector-mobile.com"
              }),
              createImage({
                format: "Product-Hero-Small-Desktop-Tablet",
                url: expectedUrl
              })
            ];
            const result = findMainImage(images);

            expect(result).toEqual(expectedUrl);
          });
        });
      });
    });
  });

  describe("generateSubtitleValues tests", () => {
    describe("when classifications does not have eligible classifications", () => {
      it("generates empty subtitle", () => {
        const textureFamilyClassFeature = createClassification({
          features: [],
          code: "not-eligible-Attributes"
        });
        const classifications = [textureFamilyClassFeature];
        const result = generateSubtitleValues(classifications);
        expect(result).toEqual("");
      });
    });

    describe("when classifications does not have features", () => {
      it("generates empty subtitle", () => {
        const textureFamilyClassFeature = createClassification({
          features: undefined,
          code: "appearanceAttributes"
        });
        const classifications = [textureFamilyClassFeature];
        const result = generateSubtitleValues(classifications);
        expect(result).toEqual("");
      });
    });

    describe("when classifications has colour appearance attributes", () => {
      it("generates subtitle with colour value", () => {
        const textureFamilyClassFeature = createClassification({
          features: [
            createFeature({
              code: `colour`,
              featureValues: [createFeatureValue({ value: "gray" })]
            })
          ],
          code: "appearanceAttributes"
        });
        const classifications = [textureFamilyClassFeature];
        const result = generateSubtitleValues(classifications);
        expect(result).toEqual("gray");
      });
    });

    describe("when classifications has multiple colour appearance attributes", () => {
      it("generates subtitle with first avilable colour", () => {
        const textureFamilyClassFeature = createClassification({
          features: [
            createFeature({
              code: `colour`,
              featureValues: [createFeatureValue({ value: "red" })]
            })
          ],
          code: "appearanceAttributes"
        });
        const textureFamilyClassFeature2 = createClassification({
          features: [
            createFeature({
              code: `colour`,
              featureValues: [createFeatureValue({ value: "gray" })]
            })
          ],
          code: "appearanceAttributes"
        });
        const classifications = [
          textureFamilyClassFeature,
          textureFamilyClassFeature2
        ];
        const result = generateSubtitleValues(classifications);
        expect(result).toEqual("red");
      });
    });

    describe("when classifications has multiple colour appearance attributes but single one has feature value", () => {
      it("generates subtitle with first avilable colour", () => {
        const textureFamilyClassFeature = createClassification({
          features: [
            createFeature({
              code: `colour`,
              featureValues: undefined
            })
          ],
          code: "appearanceAttributes"
        });
        const textureFamilyClassFeature2 = createClassification({
          features: [
            createFeature({
              code: `colour`,
              featureValues: [createFeatureValue({ value: "gray" })]
            })
          ],
          code: "appearanceAttributes"
        });
        const classifications = [
          textureFamilyClassFeature,
          textureFamilyClassFeature2
        ];
        const result = generateSubtitleValues(classifications);
        expect(result).toEqual("");
      });
    });

    describe("when classifications has texturefamily appearance attribute", () => {
      it("generates subtitle", () => {
        const textureFamilyClassFeature = createClassification({
          features: [
            createFeature({
              code: `texturefamily`,
              featureValues: [createFeatureValue({ value: "glossy" })]
            })
          ],
          code: "appearanceAttributes"
        });
        const classifications = [textureFamilyClassFeature];
        const result = generateSubtitleValues(classifications);
        expect(result).toEqual("glossy");
      });
    });

    describe("when classifications has multiple texturefamily appearance attribute", () => {
      it("generates subtitle", () => {
        const textureFamilyClassFeature = createClassification({
          features: [
            createFeature({
              code: `texturefamily`,
              featureValues: [createFeatureValue({ value: "smooth" })]
            })
          ],
          code: "appearanceAttributes"
        });
        const textureFamilyClassFeature2 = createClassification({
          features: [
            createFeature({
              code: `texturefamily`,
              featureValues: [createFeatureValue({ value: "glossy" })]
            })
          ],
          code: "appearanceAttributes"
        });
        const classifications = [
          textureFamilyClassFeature,
          textureFamilyClassFeature2
        ];
        const result = generateSubtitleValues(classifications);
        expect(result).toEqual("smooth");
      });
    });

    describe("when classifications has colour and texturefamily appearance attributes", () => {
      it("generates subtitle", () => {
        const textureFamilyClassFeature = createClassification({
          features: [
            createFeature({
              code: `colour`,
              featureValues: [createFeatureValue({ value: "gray" })]
            }),
            createFeature({
              code: `texturefamily`,
              featureValues: [createFeatureValue({ value: "smooth" })]
            })
          ],
          code: "appearanceAttributes"
        });
        const classifications = [textureFamilyClassFeature];
        const result = generateSubtitleValues(classifications);
        expect(result).toEqual("gray, smooth");
      });
    });
  });
});
