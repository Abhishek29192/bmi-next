import { generateSimpleProductUrl, generateUrl } from "../product-url-path";
import {
  createBaseProduct,
  createVariantOption
} from "../../__tests__/PimDocumentProductHelper";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";
import {
  ClassificationCodeEnum,
  FeatureCodeEnum
} from "../../components/types/pim";

describe("product-url-path tests", () => {
  describe("generateUrl tests", () => {
    describe("When url parts has special characters", () => {
      describe("And one single url part is provided", () => {
        describe("with ONLY special characters", () => {
          it("removes ALL special characters", () => {
            const result = generateUrl([
              `±!£$%^&*()+~\`¡€#¢∞§¶•–≠«‘“{}\`∑®†¥¨^¬˚∆˙©∂≈√∫~≤≥÷≠`
            ]);
            expect(result).toEqual("");
          });
        });
        describe("with special characters and `_`", () => {
          it("removes ALL special characters as well as all occuranes of spaces '_' with single '-'", () => {
            const result = generateUrl([
              `±!£$%___^&*()+~_\`¡€#¢______∞§¶•–≠«‘“{}\`_____∑®†¥¨^¬˚∆˙©∂≈√∫~≤≥÷≠`
            ]);
            expect(result).toEqual("-");
          });
        });
        describe("with special characters and multiple spaces", () => {
          it("removes ALL special characters as well as all occuranes of spaces with single '-'", () => {
            const result = generateUrl([
              `±!£$%    ^&*()+~_\`¡€#¢    ∞§¶•–≠«‘“{}\`   ∑®†¥¨^¬˚∆˙©∂≈√∫~≤≥÷≠/`
            ]);
            expect(result).toEqual("-");
          });
        });
        describe("with special characters, '_' and multiple spaces", () => {
          it("removes ALL special characters as well as all occuranes of '_' and spaces with single '-'", () => {
            const result = generateUrl([
              `±!£$%    ^&*()+~_\`______¡€#¢    ∞§¶•–≠«___‘“{}\`   ∑®†¥¨^¬˚∆˙©∂______≈√∫~≤≥÷≠/`
            ]);
            expect(result).toEqual("-");
          });
        });
        describe("with some text", () => {
          it("removes ALL special characters", () => {
            const result = generateUrl([
              `Thickness\`: 1~40#mm $Wid!th:1.'5m, Th{ic?kn;"e}s\\s: 200[m]m W<i>d,th:2.5m`
            ]);
            expect(result).toEqual(
              "thickness-140mm-width1-5m-thickness-200mm-wid-th2-5m"
            );
          });
        });
        describe("with `/` in any attributes text", () => {
          it("replaces `/` with `-` ", () => {
            const result = generateUrl([
              `Firstanfang/endstein glatt Protector`,
              `Reduzierung NW 100/70`,
              `Glasfaservlies 120g/m²`
            ]);
            expect(result).toEqual(
              "firstanfang-endstein-glatt-protector-reduzierung-nw-100-70-glasfaservlies-120g-m"
            );
          });
          it("replaces repeated occurances of `/` with single `-` ", () => {
            const result = generateUrl([
              `Firstanfang//endstein glatt Protector`,
              `Reduzierung NW 100//70`,
              `Glasfaservlies 120g////m²`
            ]);
            expect(result).toEqual(
              "firstanfang-endstein-glatt-protector-reduzierung-nw-100-70-glasfaservlies-120g-m"
            );
          });
        });
      });

      describe("And multiple url parts are provided", () => {
        describe("with special characters", () => {
          it("removes ALL special characters", () => {
            const result = generateUrl([
              `Thickness\`: 1~40#mm $Wid!th:1.'5m, Th{ic?kne}s\\s: 200[m]m W<i>d,th:2.5m`,
              null,
              `color\`: teg~lrød# $hEIg!ht:2.+9&0m=, we{ig?ht}\\: 300(k)g W@i>d{th:3}3m-også`
            ]);
            expect(result).toEqual(
              "thickness-140mm-width1-5m-thickness-200mm-wid-th2-5m-color-teglrød-height2-90m-weight-300kg-width33m-også"
            );
          });
        });

        describe("with unicode characters", () => {
          it("removes ALL special characters and unicode characters", () => {
            const result = generateUrl([
              `Thickness\`: 1~40#mm $Widœ∑´®†¥¨^øπ“‘æ…˚∆˙©ƒ∂ßåç≈√∫~µ≤≥÷≠–ª•¶§∞¢#€¡‚·!th:1.'5m, Th{ic?kne}s\\s: 200[m]m W<i>d,th:2.5m£~$@~∑´œ∑´˙˚∆≤~çß¬´ß¬˚ƒ•¶#~¡€˚∆˙˙çß¬∂∆˚çßµ∫~∫∫ß√ç¬…¬å¨^¥∑´˙√ç`,
              null,
              `color\`: teg~lrød# $hEIg!ht:2.+9&0m=, we{ig?ht}\\: 300(k)g W@i>d{th:3}3m-også`
            ]);
            expect(result).toEqual(
              "thickness-140mm-widœøπæƒßåçµªth1-5m-thickness-200mm-wid-th2-5mœçßßƒçßçßµßçåç-color-teglrød-height2-90m-weight-300kg-width33m-også"
            );
          });
        });
        describe("with DE (German) and unicode characters", () => {
          it("removes ALL special characters and keeps language specific characters", () => {
            const result = generateUrl([
              `Thickness\`: 1~40#mm $Widœ∑´®†¥¨^øπ“‘æ…˚∆˙©ƒ∂ßåç≈√∫~µ≤≥÷≠–ª•¶§∞¢#€¡‚·!th:1.'5m, Th{ic?kne}s\\s: 200[m]m W<i>d,th:2.5m£~$@~∑´œ∑´˙˚∆≤~çLebensabschnittsgefährte rectequeß¬´ß¬˚ƒ•¶#~¡€˚∆˙˙çß¬∂∆˚çßµ∫~∫∫ß√ç¬…¬å¨^¥∑´˙√ç`,
              null,
              `color\`: teg~lrød# $hEIg!ht:2.+9&adhuc laboramus sadipscing per Vorsprung durch Technik in mei ullum gloriatur0m=, we{ig?ht}\\: 300(k)g W@Die Ärztei>d{th:3}3m-også`
            ]);
            expect(result).toEqual(
              "thickness-140mm-widœøπæƒßåçµªth1-5m-thickness-200mm-wid-th2-5mœçlebensabschnittsgefährte-rectequeßßƒçßçßµßçåç-color-teglrød-height2-9adhuc-laboramus-sadipscing-per-vorsprung-durch-technik-in-mei-ullum-gloriatur0m-weight-300kg-wdie-ärzteidth33m-også"
            );
          });
        });
        describe("with `.` and `,`", () => {
          describe("And there are single `.` and `,` in many separate locations", () => {
            it("removes all `.` and `,` and replaces them with single `-`", () => {
              const result = generateUrl([
                `Thickness: 1.40mm Width:1,5m,   Thickness: 20,000,00nm Width:2.5m`,
                null,
                `color: teglrød hEIght:2.90m, weight: 300(k)g Width:33333,33.33m-også, material=ubehandlet overflate`
              ]);
              expect(result).toEqual(
                "thickness-1-40mm-width1-5m-thickness-20-000-00nm-width2-5m-color-teglrød-height2-90m-weight-300kg-width33333-33-33m-også-materialubehandlet-overflate"
              );
            });
          });

          describe("And there are repeated series of `.` and `,`", () => {
            it("removes ALL occurances of repeated `.` and `,` and replaces them with single `-`", () => {
              const result = generateUrl([
                `Thickness: 1.,40mm Width:1,.5m,, Thickness: 20.,.,000,.00nm Width:2.,5m`,
                null,
                `color: teglrød hEIght:2..90m, weight: 300(k)g Width:33333,,33..,..,,.33m---også, material=ubehandlet overflate`
              ]);
              expect(result).toEqual(
                "thickness-1-40mm-width1-5m-thickness-20-000-00nm-width2-5m-color-teglrød-height2-90m-weight-300kg-width33333-33-33m-også-materialubehandlet-overflate"
              );
            });
          });

          describe("And there are repeated series of `.` , '_' and `,`", () => {
            it("removes ALL occurances of repeated `.` , '_' and `,` and replaces them with single `-`", () => {
              const result = generateUrl([
                "zanda_arktis___normalstein",
                `Thickness: 1.,__40mm Width:1,.5m,, Thick__ness: 20.,.,000,.00nm Width:2.__,5m`,
                null,
                `color: teglrød hE_Ight:2..90m, weight: 300(k)g Width:33333,,33..,..,,.33m---også, material=ubehandlet overflate`
              ]);
              expect(result).toEqual(
                "zanda-arktis-normalstein-thickness-1-40mm-width1-5m-thick-ness-20-000-00nm-width2-5m-color-teglrød-he-ight2-90m-weight-300kg-width33333-33-33m-også-materialubehandlet-overflate"
              );
            });
          });
        });
      });
    });
  });
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
                code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                features: [
                  createFeature({
                    code: FeatureCodeEnum.COLOUR,
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
                code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                features: [
                  createFeature({
                    code: FeatureCodeEnum.TEXTURE_FAMILY,
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
                code: ClassificationCodeEnum.GENERAL_INFORMATION,
                name: ClassificationCodeEnum.GENERAL_INFORMATION,
                features: [
                  createFeature({
                    code: FeatureCodeEnum.MATERIALS,
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
                  code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.COLOUR,
                      featureValues: [{ code: "RED", value: "red" }]
                    }),
                    createFeature({
                      code: FeatureCodeEnum.TEXTURE_FAMILY,
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
                  code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.COLOUR,
                      featureValues: [{ code: "RED", value: "red" }]
                    })
                  ]
                }),
                createClassification({
                  code: ClassificationCodeEnum.GENERAL_INFORMATION,
                  name: ClassificationCodeEnum.GENERAL_INFORMATION,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.MATERIALS,
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
                  code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.TEXTURE_FAMILY,
                      featureValues: [{ code: "SMOOTH", value: "smooth" }]
                    })
                  ]
                }),
                createClassification({
                  code: ClassificationCodeEnum.GENERAL_INFORMATION,
                  name: ClassificationCodeEnum.GENERAL_INFORMATION,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.MATERIALS,
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
                  code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.COLOUR,
                      featureValues: [{ code: "RED", value: "red" }]
                    }),
                    createFeature({
                      code: FeatureCodeEnum.TEXTURE_FAMILY,
                      featureValues: [{ code: "SMOOTH", value: "smooth" }]
                    })
                  ]
                }),
                createClassification({
                  code: ClassificationCodeEnum.GENERAL_INFORMATION,
                  name: ClassificationCodeEnum.GENERAL_INFORMATION,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.MATERIALS,
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
                  code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.COLOUR,
                      featureValues: [{ code: "RED", value: "red" }]
                    }),
                    createFeature({
                      code: FeatureCodeEnum.TEXTURE_FAMILY,
                      featureValues: []
                    })
                  ]
                }),
                createClassification({
                  code: ClassificationCodeEnum.GENERAL_INFORMATION,
                  name: ClassificationCodeEnum.GENERAL_INFORMATION,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.MATERIALS,
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
                  code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  features: [
                    createFeature({
                      code: FeatureCodeEnum.COLOUR,
                      featureValues: [{ code: "RED", value: "red" }]
                    }),
                    createFeature({
                      code: FeatureCodeEnum.TEXTURE_FAMILY,
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
                code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
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
                code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
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
              code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
              name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
              features: [
                createFeature({
                  code: FeatureCodeEnum.COLOUR,
                  featureValues: [{ code: "RED", value: "red" }]
                }),
                createFeature({
                  code: FeatureCodeEnum.TEXTURE_FAMILY,
                  featureValues: [{ code: "SMOOTH", value: "smooth" }]
                })
              ]
            }),
            createClassification({
              code: ClassificationCodeEnum.GENERAL_INFORMATION,
              name: ClassificationCodeEnum.GENERAL_INFORMATION,
              features: [
                createFeature({
                  code: FeatureCodeEnum.MATERIALS,
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
