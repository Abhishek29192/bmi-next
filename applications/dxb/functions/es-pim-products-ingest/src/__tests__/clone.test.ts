import mockConsole from "jest-mock-console";
import {
  Classification,
  createVariantOption,
  createProduct as createPimProduct,
  createClassification,
  createFeature,
  createFeatureValue,
  createFeatureUnit,
  createMeasurementsClassification,
  createTwoOneClassifications
} from "@bmi/pim-types";
import {
  ESIndexObject,
  groupBy,
  IndexedItemGroup,
  indexFeatures,
  getSizeLabel,
  mapProductClassifications
} from "../CLONE";

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
        code: {
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
        code: {
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
      const expectedCode = "pim-namespace1.0/feature-code-1";
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
            "feature-code-1": [
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
            "classification-feature-code": [
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
            "classification-feature-code": [
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
            "classification-feature-code": [
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
            "classification-feature-code-2": [
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
            "feature-code-1": [
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
            "classification-feature-code": [
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
            "classification-feature-code": [
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
            "classification-feature-code": [
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
            "classification-feature-code-2": [
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
              "classification-feature-code": [
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
              "classification-feature-code-2": [
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
});
