import { generateSimpleProductUrl } from "../product-url-path";
import {
  createBaseProduct,
  createVariantOption
} from "../../__tests__/PimDocumentProductHelper";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";

describe("product-url-path tests", () => {
  describe("When useVariantAttribute is `false`", () => {
    describe("And feature attributes do NOT exist", () => {
      it("generates simple url with product name and hash", () => {
        const result = generateSimpleProductUrl(
          createBaseProduct(),
          createVariantOption(),
          "7824579245254",
          false
        );
        expect(result).toEqual("product-name-7824579245254");
      });
    });
    describe("And ONLY `colour` feature attribute exists", () => {
      it("generates simple url with product name, colour value and hash", () => {
        const result = generateSimpleProductUrl(
          createBaseProduct(),
          createVariantOption({
            classifications: [
              createClassification({
                code: "appearanceAttributes",
                name: "appearanceAttributes",
                features: [
                  createFeature({
                    code: "colour",
                    featureValues: [{ code: "RED", value: "red" }]
                  })
                ]
              })
            ]
          }),
          "7824579245254",
          false
        );
        expect(result).toEqual("product-name-red-7824579245254");
      });
    });
    describe("And ONLY `texturefamily` feature attribute exists", () => {
      it("generates simple url with product name, texturefamily and hash", () => {
        const result = generateSimpleProductUrl(
          createBaseProduct(),
          createVariantOption({
            classifications: [
              createClassification({
                code: "appearanceAttributes",
                name: "appearanceAttributes",
                features: [
                  createFeature({
                    code: "texturefamily",
                    featureValues: [{ code: "SMOOTH", value: "smooth" }]
                  })
                ]
              })
            ]
          }),
          "7824579245254",
          false
        );
        expect(result).toEqual("product-name-smooth-7824579245254");
      });
    });
    describe("And ONLY `materials` feature attribute exists", () => {
      it("generates simple url with product name, materials and hash", () => {
        const result = generateSimpleProductUrl(
          createBaseProduct(),
          createVariantOption({
            classifications: [
              createClassification({
                code: "generalInformation",
                name: "generalInformation",
                features: [
                  createFeature({
                    code: "materials",
                    featureValues: [{ code: "OVERFLATE", value: "overflate" }]
                  })
                ]
              })
            ]
          }),
          "7824579245254",
          false
        );
        expect(result).toEqual("product-name-overflate-7824579245254");
      });
    });
    describe("And Two of the three feature attributes exists", () => {
      describe("And `colour` and `texturefamily` feature attributes exists", () => {
        it("generates simple url with product name, colour value , texturefamily value and hash", () => {
          const result = generateSimpleProductUrl(
            createBaseProduct(),
            createVariantOption({
              classifications: [
                createClassification({
                  code: "appearanceAttributes",
                  name: "appearanceAttributes",
                  features: [
                    createFeature({
                      code: "colour",
                      featureValues: [{ code: "RED", value: "red" }]
                    }),
                    createFeature({
                      code: "texturefamily",
                      featureValues: [{ code: "SMOOTH", value: "smooth" }]
                    })
                  ]
                })
              ]
            }),
            "7824579245254",
            false
          );
          expect(result).toEqual("product-name-red-smooth-7824579245254");
        });
      });
      describe("And `colour` and `materials` feature attributes exists", () => {
        it("generates simple url with product name, colour value , materials value and hash", () => {
          const result = generateSimpleProductUrl(
            createBaseProduct(),
            createVariantOption({
              classifications: [
                createClassification({
                  code: "appearanceAttributes",
                  name: "appearanceAttributes",
                  features: [
                    createFeature({
                      code: "colour",
                      featureValues: [{ code: "RED", value: "red" }]
                    })
                  ]
                }),
                createClassification({
                  code: "generalInformation",
                  name: "generalInformation",
                  features: [
                    createFeature({
                      code: "materials",
                      featureValues: [{ code: "OVERFLATE", value: "overflate" }]
                    })
                  ]
                })
              ]
            }),
            "7824579245254",
            false
          );
          expect(result).toEqual("product-name-red-overflate-7824579245254");
        });
      });
      describe("And `texturefamily` and `materials` feature attributes exists", () => {
        it("generates simple url with product name, texturefamily value , materials value and hash", () => {
          const result = generateSimpleProductUrl(
            createBaseProduct(),
            createVariantOption({
              classifications: [
                createClassification({
                  code: "appearanceAttributes",
                  name: "appearanceAttributes",
                  features: [
                    createFeature({
                      code: "texturefamily",
                      featureValues: [{ code: "SMOOTH", value: "smooth" }]
                    })
                  ]
                }),
                createClassification({
                  code: "generalInformation",
                  name: "generalInformation",
                  features: [
                    createFeature({
                      code: "materials",
                      featureValues: [{ code: "OVERFLATE", value: "overflate" }]
                    })
                  ]
                })
              ]
            }),
            "7824579245254",
            false
          );
          expect(result).toEqual("product-name-smooth-overflate-7824579245254");
        });
      });
    });

    describe("And All Three feature attributes exists", () => {
      describe("And features have at least one value", () => {
        it("generates simple url with product name, ALL three attribute values and hash", () => {
          const result = generateSimpleProductUrl(
            createBaseProduct(),
            createVariantOption({
              classifications: [
                createClassification({
                  code: "appearanceAttributes",
                  name: "appearanceAttributes",
                  features: [
                    createFeature({
                      code: "colour",
                      featureValues: [{ code: "RED", value: "red" }]
                    }),
                    createFeature({
                      code: "texturefamily",
                      featureValues: [{ code: "SMOOTH", value: "smooth" }]
                    })
                  ]
                }),
                createClassification({
                  code: "generalInformation",
                  name: "generalInformation",
                  features: [
                    createFeature({
                      code: "materials",
                      featureValues: [{ code: "OVERFLATE", value: "overflate" }]
                    })
                  ]
                })
              ]
            }),
            "7824579245254",
            false
          );
          expect(result).toEqual(
            "product-name-red-smooth-overflate-7824579245254"
          );
        });
      });
      describe("And some eatures do NOT have at least one value", () => {
        it("generates simple url with product name, ALL three attribute values and hash", () => {
          const result = generateSimpleProductUrl(
            createBaseProduct(),
            createVariantOption({
              classifications: [
                createClassification({
                  code: "appearanceAttributes",
                  name: "appearanceAttributes",
                  features: [
                    createFeature({
                      code: "colour",
                      featureValues: [{ code: "RED", value: "red" }]
                    }),
                    createFeature({
                      code: "texturefamily",
                      featureValues: []
                    })
                  ]
                }),
                createClassification({
                  code: "generalInformation",
                  name: "generalInformation",
                  features: [
                    createFeature({
                      code: "materials",
                      featureValues: [{ code: "OVERFLATE", value: "overflate" }]
                    })
                  ]
                })
              ]
            }),
            "7824579245254",
            false
          );
          expect(result).toEqual("product-name-red-overflate-7824579245254");
        });
      });
    });
  });

  describe("When useVariantAttribute is `true`", () => {
    describe("And `variantattribute` and other feature attributes do NOT exist", () => {
      describe("And other feature attributes do NOT exist", () => {
        it("generates simple url with product name and hash", () => {
          const result = generateSimpleProductUrl(
            createBaseProduct(),
            createVariantOption(),
            "7824579245254",
            true
          );
          expect(result).toEqual("product-name-7824579245254");
        });
      });

      describe("And other feature attributes exists", () => {
        it("generates simple url with available fallback feature attributes", () => {
          const result = generateSimpleProductUrl(
            createBaseProduct(),
            createVariantOption({
              classifications: [
                createClassification({
                  code: "appearanceAttributes",
                  name: "appearanceAttributes",
                  features: [
                    createFeature({
                      code: "colour",
                      featureValues: [{ code: "RED", value: "red" }]
                    }),
                    createFeature({
                      code: "texturefamily",
                      featureValues: [{ code: "SMOOTH", value: "smooth" }]
                    })
                  ]
                })
              ]
            }),
            "7824579245254",
            true
          );
          expect(result).toEqual("product-name-red-smooth-7824579245254");
        });
      });
    });
    describe("And variantattribute feature attribute with value exists", () => {
      it("generates simple url with product name, variantattribute value and hash", () => {
        const result = generateSimpleProductUrl(
          createBaseProduct(),
          createVariantOption({
            classifications: [
              createClassification({
                code: "appearanceAttributes",
                name: "appearanceAttributes",
                features: [
                  createFeature({
                    code: "variantattribute",
                    featureValues: [
                      {
                        code: "var-attrib-1",
                        value: "110mm length and variant attribute"
                      }
                    ]
                  })
                ]
              })
            ]
          }),
          "7824579245254",
          true
        );
        expect(result).toEqual(
          "product-name-110mm-length-and-variant-attribute-7824579245254"
        );
      });
    });
    describe("And variantattribute feature attribute exists but value does NOT exists", () => {
      it("generates simple url with product name and hash", () => {
        const result = generateSimpleProductUrl(
          createBaseProduct(),
          createVariantOption({
            classifications: [
              createClassification({
                code: "appearanceAttributes",
                name: "appearanceAttributes",
                features: [
                  createFeature({
                    code: "variantattribute",
                    featureValues: []
                  })
                ]
              })
            ]
          }),
          "7824579245254",
          true
        );
        expect(result).toEqual("product-name-7824579245254");
      });
    });
  });
  describe("product-url-path returns sanitised path test", () => {
    it("generates simple url with product name, ALL three attribute values and hash", () => {
      const result = generateSimpleProductUrl(
        createBaseProduct({ name: `bad*product-Name"""1` }),
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              name: "appearanceAttributes",
              features: [
                createFeature({
                  code: "colour",
                  featureValues: [{ code: "RED", value: "red" }]
                }),
                createFeature({
                  code: "texturefamily",
                  featureValues: [{ code: "SMOOTH", value: "smooth" }]
                })
              ]
            }),
            createClassification({
              code: "generalInformation",
              name: "generalInformation",
              features: [
                createFeature({
                  code: "materials",
                  featureValues: [{ code: "OVERFLATE", value: "over**flate" }]
                })
              ]
            })
          ]
        }),
        "7824579245254",
        false
      );
      expect(result).toEqual(
        "badproduct-name1-red-smooth-overflate-7824579245254"
      );
    });
  });
});
