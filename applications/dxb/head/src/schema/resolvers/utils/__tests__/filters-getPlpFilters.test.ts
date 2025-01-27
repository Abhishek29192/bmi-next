import { createFilter, createProduct } from "@bmi/firestore-types";
import { getPlpFilters } from "../filters";

describe("filters tests", () => {
  describe("getPlpFilters function", () => {
    it("should return empty filters, when product categories are null", () => {
      const baseProduct = createProduct();
      baseProduct.categories = [];
      expect(
        getPlpFilters({
          products: [baseProduct],
          allowedFilters: [],
          microCopies: new Map()
        })
      ).toStrictEqual([]);
    });
    it("should work when no filters allowed", () => {
      const baseProduct = createProduct();
      expect(
        getPlpFilters({
          products: [baseProduct],
          allowedFilters: [],
          microCopies: new Map()
        })
      ).toStrictEqual([]);
    });
    describe("category filters tests", () => {
      it("should work when BrandFilter", () => {
        const baseProduct = createProduct();
        baseProduct.filters = [
          createFilter({
            filterCode: "Brand",
            code: "AeroDeck",
            value: "AeroDeck",
            name: "AeroDeck",
            unit: "",
            isCategory: true
          })
        ];

        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: ["Brand"],
            microCopies: new Map()
          })
        ).toStrictEqual([
          {
            filterCode: "Brand",
            label: "Colour",
            name: "Brand",
            options: [
              {
                value: "AeroDeck",
                label: "AeroDeck",
                sortValue: "AeroDeck"
              }
            ],
            value: []
          }
        ]);
      });
      it("should work when Category filter", () => {
        const baseProduct = createProduct();
        baseProduct.filters = [
          createFilter({
            filterCode: "Category",
            code: "MAINTILE_STEELROOF_NO",
            value: "MAINTILE_STEELROOF_NO",
            name: "Takpanne stål",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "PRODUCTS_NO",
            value: "PRODUCTS_NO",
            name: "Produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "ROOF_NO",
            value: "ROOF_NO",
            name: "Takprodukter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "TILES_STEELROOF_NO",
            value: "TILES_STEELROOF_NO",
            name: "Ståltak produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "PITCHEDROOF_NO",
            value: "PITCHEDROOF_NO",
            name: "Skråtak",
            unit: "",
            isCategory: true
          })
        ];

        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: ["Category"],
            microCopies: new Map()
          })
        ).toStrictEqual([
          {
            name: "Category",
            filterCode: "Category",
            label: "MC:filterLabels.Category",
            value: [],
            options: [
              {
                label: "Produkter",
                value: "PRODUCTS_NO",
                sortValue: "Produkter"
              },
              {
                label: "Skråtak",
                value: "PITCHEDROOF_NO",
                sortValue: "Skråtak"
              },
              {
                label: "Ståltak produkter",
                value: "TILES_STEELROOF_NO",
                sortValue: "Ståltak produkter"
              },
              {
                label: "Takpanne stål",
                value: "MAINTILE_STEELROOF_NO",
                sortValue: "Takpanne stål"
              },
              {
                label: "Takprodukter",
                value: "ROOF_NO",
                sortValue: "Takprodukter"
              }
            ]
          }
        ]);
      });
      it("should work when Category filter with single option", () => {
        const baseProduct = createProduct();
        baseProduct.filters = [
          createFilter({
            filterCode: "Category",
            code: "MAINTILE_STEELROOF_NO",
            value: "MAINTILE_STEELROOF_NO",
            name: "Takpanne stål",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "PRODUCTS_NO",
            value: "PRODUCTS_NO",
            name: "Produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "ROOF_NO",
            value: "ROOF_NO",
            name: "Takprodukter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "TILES_STEELROOF_NO",
            value: "TILES_STEELROOF_NO",
            name: "Ståltak produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "PITCHEDROOF_NO",
            value: "PITCHEDROOF_NO",
            name: "Skråtak",
            unit: "",
            isCategory: true
          })
        ];

        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: ["Category | PITCHEDROOF_NO"],
            microCopies: new Map()
          })
        ).toStrictEqual([
          {
            name: "Category",
            filterCode: "Category",
            label: "MC:filterLabels.Category",
            options: [
              {
                value: "PITCHEDROOF_NO",
                sortValue: "Skråtak",
                label: "Skråtak"
              }
            ],
            value: []
          }
        ]);
      });
      it("should work when Category filter with multiple options", () => {
        const baseProduct = createProduct();
        baseProduct.filters = [
          createFilter({
            filterCode: "Category",
            code: "MAINTILE_STEELROOF_NO",
            value: "MAINTILE_STEELROOF_NO",
            name: "Takpanne stål",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "PRODUCTS_NO",
            value: "PRODUCTS_NO",
            name: "Produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "ROOF_NO",
            value: "ROOF_NO",
            name: "Takprodukter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "TILES_STEELROOF_NO",
            value: "TILES_STEELROOF_NO",
            name: "Ståltak produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            code: "PITCHEDROOF_NO",
            value: "PITCHEDROOF_NO",
            name: "Skråtak",
            unit: "",
            isCategory: true
          })
        ];

        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: [
              "Category | PITCHEDROOF_NO",
              "Category | TILES_STEELROOF_NO"
            ],
            microCopies: new Map()
          })
        ).toStrictEqual([
          {
            name: "Category",
            filterCode: "Category",
            label: "MC:filterLabels.Category",
            options: [
              {
                value: "PITCHEDROOF_NO",
                sortValue: "Skråtak",
                label: "Skråtak"
              },
              {
                value: "TILES_STEELROOF_NO",
                sortValue: "Ståltak produkter",
                label: "Ståltak produkter"
              }
            ],
            value: []
          }
        ]);
      });
      it("should returns narrowed down Category options when Category filter with mixed options of Category and Category option", () => {
        const baseProduct = createProduct();
        baseProduct.filters = [
          createFilter({
            filterCode: "Category",
            groupLabel: "Ståltak produkter",
            code: "MAINTILE_STEELROOF_NO",
            value: "MAINTILE_STEELROOF_NO",
            name: "Takpanne stål",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            groupLabel: undefined,
            code: "PRODUCTS_NO",
            value: "PRODUCTS_NO",
            name: "Produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            groupLabel: "Produkter",
            code: "ROOF_NO",
            value: "ROOF_NO",
            name: "Takprodukter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            groupLabel: "Skråtak",
            code: "TILES_STEELROOF_NO",
            value: "TILES_STEELROOF_NO",
            name: "Ståltak produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            groupLabel: "Takprodukter",
            code: "PITCHEDROOF_NO",
            value: "PITCHEDROOF_NO",
            name: "Skråtak",
            unit: "",
            isCategory: true
          })
        ];

        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: ["Category | PITCHEDROOF_NO", "Category"],
            microCopies: new Map()
          })
        ).toStrictEqual([
          {
            name: "Category",
            filterCode: "Category",
            label: "MC:filterLabels.Category",
            value: [],
            options: [
              {
                label: "Skråtak",
                value: "PITCHEDROOF_NO",
                sortValue: "Skråtak"
              }
            ]
          }
        ]);

        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: ["Category", "Category | PITCHEDROOF_NO"],
            microCopies: new Map()
          })
        ).toStrictEqual([
          {
            name: "Category",
            filterCode: "Category",
            label: "MC:filterLabels.Category",
            value: [],
            options: [
              {
                label: "Skråtak",
                value: "PITCHEDROOF_NO",
                sortValue: "Skråtak"
              }
            ]
          }
        ]);
      });
      it("should returns full list of Category options when only main Category filter is configured", () => {
        const baseProduct = createProduct();
        baseProduct.filters = [
          createFilter({
            filterCode: "Category",
            groupLabel: "Ståltak produkter",
            code: "MAINTILE_STEELROOF_NO",
            value: "MAINTILE_STEELROOF_NO",
            name: "Takpanne stål",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            groupLabel: undefined,
            code: "PRODUCTS_NO",
            value: "PRODUCTS_NO",
            name: "Produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            groupLabel: "Produkter",
            code: "ROOF_NO",
            value: "ROOF_NO",
            name: "Takprodukter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            groupLabel: "Skråtak",
            code: "TILES_STEELROOF_NO",
            value: "TILES_STEELROOF_NO",
            name: "Ståltak produkter",
            unit: "",
            isCategory: true
          }),
          createFilter({
            filterCode: "Category",
            groupLabel: "Takprodukter",
            code: "PITCHEDROOF_NO",
            value: "PITCHEDROOF_NO",
            name: "Skråtak",
            unit: "",
            isCategory: true
          })
        ];

        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: ["Category"],
            microCopies: new Map()
          })
        ).toStrictEqual([
          {
            name: "Category",
            filterCode: "Category",
            label: "MC:filterLabels.Category",
            value: [],
            options: [
              {
                label: "Produkter",
                sortValue: "Produkter",
                value: "PRODUCTS_NO"
              },
              {
                label: "Skråtak",
                value: "PITCHEDROOF_NO",
                sortValue: "Skråtak"
              },
              {
                label: "Ståltak produkter",
                sortValue: "Ståltak produkter",
                value: "TILES_STEELROOF_NO"
              },
              {
                label: "Takpanne stål",
                sortValue: "Takpanne stål",
                value: "MAINTILE_STEELROOF_NO"
              },
              {
                label: "Takprodukter",
                sortValue: "Takprodukter",
                value: "ROOF_NO"
              }
            ]
          }
        ]);

        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: ["Category", "Category | PITCHEDROOF_NO"],
            microCopies: new Map()
          })
        ).toStrictEqual([
          {
            name: "Category",
            filterCode: "Category",
            label: "MC:filterLabels.Category",
            value: [],
            options: [
              {
                label: "Skråtak",
                value: "PITCHEDROOF_NO",
                sortValue: "Skråtak"
              }
            ]
          }
        ]);
      });
      describe("multiple products with multiple categories tests", () => {
        it("should return the narrowed list of Category options when Category filter with mixed options of Category and Category option", () => {
          const baseProduct = createProduct();
          baseProduct.filters = [
            createFilter({
              filterCode: "Category",
              groupLabel: "Ståltak produkter",
              code: "MAINTILE_STEELROOF_NO",
              value: "MAINTILE_STEELROOF_NO",
              name: "Takpanne stål",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: undefined,
              code: "PRODUCTS_NO",
              value: "PRODUCTS_NO",
              name: "Produkter",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Produkter",
              code: "ROOF_NO",
              value: "ROOF_NO",
              name: "Takprodukter",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Skråtak",
              code: "TILES_STEELROOF_NO",
              value: "TILES_STEELROOF_NO",
              name: "Ståltak produkter",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Takprodukter",
              code: "PITCHEDROOF_NO",
              value: "PITCHEDROOF_NO",
              name: "Skråtak",
              unit: "",
              isCategory: true
            })
          ];
          const baseProduct2 = createProduct();
          baseProduct2.filters = [
            createFilter({
              filterCode: "Category",
              groupLabel: "Ståltak produkter_2",
              code: "MAINTILE_STEELROOF_NO",
              value: "MAINTILE_STEELROOF_NO",
              name: "Takpanne stål",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: undefined,
              code: "PRODUCTS_NO",
              value: "PRODUCTS_NO",
              name: "Produkter",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Produkter",
              code: "ROOF_NO_2",
              value: "ROOF_NO_2",
              name: "Takprodukter_2",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Skråtak_2",
              code: "TILES_STEELROOF_NO_2",
              value: "TILES_STEELROOF_NO_2",
              name: "Ståltak produkter_2",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Takprodukter_2",
              code: "PITCHEDROOF_NO_2",
              value: "PITCHEDROOF_NO_2",
              name: "Skråtak_2",
              unit: "",
              isCategory: true
            })
          ];

          expect(
            getPlpFilters({
              products: [baseProduct, baseProduct2],
              allowedFilters: ["Category | PITCHEDROOF_NO", "Category"],
              microCopies: new Map()
            })
          ).toEqual([
            {
              name: "Category",
              filterCode: "Category",
              label: "MC:filterLabels.Category",
              value: [],
              options: [
                {
                  label: "Skråtak",
                  value: "PITCHEDROOF_NO",
                  sortValue: "Skråtak"
                }
              ]
            }
          ]);

          expect(
            getPlpFilters({
              products: [baseProduct, baseProduct2],
              allowedFilters: ["Category", "Category | PITCHEDROOF_NO"],
              microCopies: new Map()
            })
          ).toStrictEqual([
            {
              name: "Category",
              filterCode: "Category",
              label: "MC:filterLabels.Category",
              value: [],
              options: [
                {
                  label: "Skråtak",
                  value: "PITCHEDROOF_NO",
                  sortValue: "Skråtak"
                }
              ]
            }
          ]);
        });

        it("should return the whole Category options when Category filter configured", () => {
          const baseProduct = createProduct();
          baseProduct.filters = [
            createFilter({
              filterCode: "Category",
              groupLabel: "Ståltak produkter",
              code: "MAINTILE_STEELROOF_NO",
              value: "MAINTILE_STEELROOF_NO",
              name: "Takpanne stål",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: undefined,
              code: "PRODUCTS_NO",
              value: "PRODUCTS_NO",
              name: "Produkter",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Produkter",
              code: "ROOF_NO",
              value: "ROOF_NO",
              name: "Takprodukter",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Skråtak",
              code: "TILES_STEELROOF_NO",
              value: "TILES_STEELROOF_NO",
              name: "Ståltak produkter",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Takprodukter",
              code: "PITCHEDROOF_NO",
              value: "PITCHEDROOF_NO",
              name: "Skråtak",
              unit: "",
              isCategory: true
            })
          ];
          const baseProduct2 = createProduct();
          baseProduct2.filters = [
            createFilter({
              filterCode: "Category",
              groupLabel: "Ståltak produkter_2",
              code: "MAINTILE_STEELROOF_NO",
              value: "MAINTILE_STEELROOF_NO",
              name: "Takpanne stål",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: undefined,
              code: "PRODUCTS_NO",
              value: "PRODUCTS_NO",
              name: "Produkter",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Produkter",
              code: "ROOF_NO_2",
              value: "ROOF_NO_2",
              name: "Takprodukter_2",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Skråtak_2",
              code: "TILES_STEELROOF_NO_2",
              value: "TILES_STEELROOF_NO_2",
              name: "Ståltak produkter_2",
              unit: "",
              isCategory: true
            }),
            createFilter({
              filterCode: "Category",
              groupLabel: "Takprodukter_2",
              code: "PITCHEDROOF_NO_2",
              value: "PITCHEDROOF_NO_2",
              name: "Skråtak_2",
              unit: "",
              isCategory: true
            })
          ];

          expect(
            getPlpFilters({
              products: [baseProduct, baseProduct2],
              allowedFilters: ["Category"],
              microCopies: new Map()
            })
          ).toEqual([
            {
              name: "Category",
              filterCode: "Category",
              label: "MC:filterLabels.Category",
              value: [],
              options: [
                {
                  label: "Produkter",
                  sortValue: "Produkter",
                  value: "PRODUCTS_NO"
                },
                {
                  label: "Skråtak",
                  value: "PITCHEDROOF_NO",
                  sortValue: "Skråtak"
                },
                {
                  label: "Skråtak_2",
                  sortValue: "Skråtak_2",
                  value: "PITCHEDROOF_NO_2"
                },
                {
                  label: "Ståltak produkter",
                  sortValue: "Ståltak produkter",
                  value: "TILES_STEELROOF_NO"
                },
                {
                  label: "Ståltak produkter_2",
                  sortValue: "Ståltak produkter_2",
                  value: "TILES_STEELROOF_NO_2"
                },
                {
                  label: "Takpanne stål",
                  sortValue: "Takpanne stål",
                  value: "MAINTILE_STEELROOF_NO"
                },
                {
                  label: "Takprodukter",
                  sortValue: "Takprodukter",
                  value: "ROOF_NO"
                },
                {
                  label: "Takprodukter_2",
                  sortValue: "Takprodukter_2",
                  value: "ROOF_NO_2"
                }
              ]
            }
          ]);

          expect(
            getPlpFilters({
              products: [baseProduct, baseProduct2],
              allowedFilters: ["Category", "Category | PITCHEDROOF_NO"],
              microCopies: new Map()
            })
          ).toStrictEqual([
            {
              name: "Category",
              filterCode: "Category",
              label: "MC:filterLabels.Category",
              value: [],
              options: [
                {
                  label: "Skråtak",
                  value: "PITCHEDROOF_NO",
                  sortValue: "Skråtak"
                }
              ]
            }
          ]);
        });
      });
    });
    // describe("classification features filter tests", () => {
    //   describe("multiple products with single classifications tests", () => {
    //     it("should return the classification options", () => {
    //       const baseProduct = createProduct();
    //       baseProduct.classifications = [
    //         createClassification({
    //           code: ClassificationCodeEnum.MEASUREMENTS,
    //           features: [
    //             createFeature({
    //               code: "measurements.length",
    //               name: "length",
    //               featureValues: [{ value: "100", code: "100" }]
    //             })
    //           ]
    //         })
    //       ];

    //       const baseProduct2 = createProduct();
    //       baseProduct2.classifications = [
    //         createClassification({
    //           code: ClassificationCodeEnum.MEASUREMENTS,
    //           features: [
    //             createFeature({
    //               code: "measurements.length",
    //               name: "length",
    //               featureValues: [{ value: "100", code: "100" }]
    //             })
    //           ]
    //         })
    //       ];

    //       expect(
    //         getPlpFilters({
    //           pimClassificationNamespace: "",
    //           products: [baseProduct, baseProduct2],
    //           allowedFilters: ["measurements.length"]
    //         })
    //       ).toStrictEqual([
    //         {
    //           name: "measurements.length",
    //           label: "length",
    //           options: [
    //             {
    //               label: "100 classification-feature-feature-unit-symbol",
    //               value: "100classification-feature-feature-unit-symbol",
    //               sortValue: 100
    //             }
    //           ],
    //           value: []
    //         }
    //       ]);

    //       expect(
    //         getPlpFilters({
    //           pimClassificationNamespace: "",
    //           products: [baseProduct, baseProduct2],
    //           allowedFilters: ["measurements.length", "measurements.width"]
    //         })
    //       ).toStrictEqual([
    //         {
    //           name: "measurements.length",
    //           label: "length",
    //           options: [
    //             {
    //               label: "100 classification-feature-feature-unit-symbol",
    //               value: "100classification-feature-feature-unit-symbol",
    //               sortValue: 100
    //             }
    //           ],
    //           value: []
    //         }
    //       ]);
    //     });
    //   });

    //   describe("multiple products with multiple classifications tests", () => {
    //     describe("and all classification names are valid", () => {
    //       it("should return the classification options", () => {
    //         const baseProduct = createProduct();
    //         baseProduct.classifications = [
    //           createClassification({
    //             code: ClassificationCodeEnum.GENERAL_INFORMATION,
    //             features: [
    //               createFeature({
    //                 code: "measurements.length",
    //                 name: "length",
    //                 featureValues: [{ value: "100", code: "100" }]
    //               })
    //             ]
    //           }),
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.width",
    //                 name: "width",
    //                 featureValues: [{ value: "200", code: "200" }]
    //               })
    //             ]
    //           })
    //         ];

    //         const baseProduct2 = createProduct();
    //         baseProduct2.classifications = [
    //           createClassification({
    //             code: ClassificationCodeEnum.GENERAL_INFORMATION,
    //             features: [
    //               createFeature({
    //                 code: "measurements.length",
    //                 name: "length",
    //                 featureValues: [{ value: "100", code: "100" }]
    //               })
    //             ]
    //           }),
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.width",
    //                 name: "width",
    //                 featureValues: [{ value: "300", code: "300" }]
    //               })
    //             ]
    //           })
    //         ];

    //         const result = getPlpFilters({
    //           pimClassificationNamespace: "",
    //           products: [baseProduct, baseProduct2],
    //           allowedFilters: ["measurements.length", "measurements.width"]
    //         });

    //         const expectedResult = [
    //           {
    //             name: "measurements.length",
    //             label: "length",
    //             options: [
    //               {
    //                 label: "100 classification-feature-feature-unit-symbol",
    //                 value: "100classification-feature-feature-unit-symbol",
    //                 sortValue: 100
    //               }
    //             ],
    //             value: []
    //           },
    //           {
    //             name: "measurements.width",
    //             label: "width",
    //             options: [
    //               {
    //                 label: "200 classification-feature-feature-unit-symbol",
    //                 value: "200classification-feature-feature-unit-symbol",
    //                 sortValue: 200
    //               },
    //               {
    //                 label: "300 classification-feature-feature-unit-symbol",
    //                 value: "300classification-feature-feature-unit-symbol",
    //                 sortValue: 300
    //               }
    //             ],
    //             value: []
    //           }
    //         ];

    //         expect(result).toStrictEqual(expectedResult);
    //       });
    //     });
    //     describe("and some classification names are invalid", () => {
    //       it("should return the valid classification options", () => {
    //         const baseProduct = createProduct();
    //         baseProduct.classifications = [
    //           createClassification({
    //             code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
    //             features: [
    //               createFeature({
    //                 code: "measurements.length",
    //                 name: "length",
    //                 featureValues: [{ value: "100", code: "100" }]
    //               })
    //             ]
    //           }),
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.width",
    //                 name: "width",
    //                 featureValues: [{ value: "200", code: "200" }]
    //               })
    //             ]
    //           })
    //         ];

    //         const baseProduct2 = createProduct();
    //         baseProduct2.classifications = [
    //           createClassification({
    //             code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
    //             features: [
    //               createFeature({
    //                 code: "measurements.length",
    //                 name: "length",
    //                 featureValues: [{ value: "100", code: "100" }]
    //               })
    //             ]
    //           }),
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.width",
    //                 name: "width",
    //                 featureValues: [{ value: "300", code: "300" }]
    //               })
    //             ]
    //           })
    //         ];

    //         expect(
    //           getPlpFilters({
    //             pimClassificationNamespace: "",
    //             products: [baseProduct, baseProduct2],
    //             allowedFilters: [
    //               "measurements.length",
    //               "measurements.invalid.2",
    //               "measurements.width",
    //               "measurements.invalid"
    //             ]
    //           })
    //         ).toStrictEqual([
    //           {
    //             name: "measurements.length",
    //             label: "length",
    //             options: [
    //               {
    //                 label: "100 classification-feature-feature-unit-symbol",
    //                 value: "100classification-feature-feature-unit-symbol",
    //                 sortValue: 100
    //               }
    //             ],
    //             value: []
    //           },
    //           {
    //             name: "measurements.width",
    //             label: "width",
    //             options: [
    //               {
    //                 label: "200 classification-feature-feature-unit-symbol",
    //                 value: "200classification-feature-feature-unit-symbol",
    //                 sortValue: 200
    //               },
    //               {
    //                 label: "300 classification-feature-feature-unit-symbol",
    //                 value: "300classification-feature-feature-unit-symbol",
    //                 sortValue: 300
    //               }
    //             ],
    //             value: []
    //           }
    //         ]);
    //       });
    //     });
    //     describe("and ALL classification names are invalid", () => {
    //       it("should return the empty filters", () => {
    //         const baseProduct = createProduct();
    //         baseProduct.classifications = [
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.length",
    //                 featureValues: [{ value: "100" }]
    //               })
    //             ]
    //           }),
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.width",
    //                 featureValues: [{ value: "200" }]
    //               })
    //             ]
    //           })
    //         ];

    //         const baseProduct2 = createProduct();
    //         baseProduct2.classifications = [
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.length",
    //                 featureValues: [{ value: "100" }]
    //               })
    //             ]
    //           }),
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.width",
    //                 featureValues: [{ value: "300" }]
    //               })
    //             ]
    //           })
    //         ];

    //         expect(
    //           getPlpFilters({
    //             pimClassificationNamespace: "",
    //             products: [baseProduct, baseProduct2],
    //             allowedFilters: [
    //               "measurements.invalid.2",
    //               "measurements.invalid",
    //               "invalid.invalid"
    //             ]
    //           })
    //         ).toStrictEqual([]);
    //       });
    //     });
    //   });
    // });
    // describe("All Filter order test", () => {
    //   describe("When multiple products with multiple classifications and Categories are provided tests", () => {
    //     describe("and mixed filterby criteria is applied", () => {
    //       it("should return filters in the order of the filterby criteria", () => {
    //         const baseProduct = createProduct();
    //         baseProduct.categories = [
    //           createCategory({
    //             categoryType: "Category",
    //             code: "MAINTILE_STEELROOF_NO",
    //             name: "Takpanne stål"
    //           }),
    //           createCategory({
    //             categoryType: "Category",
    //             code: "PRODUCTS_NO",
    //             name: "Produkter"
    //           }),
    //           createCategory({
    //             categoryType: "Category",
    //             code: "ROOF_NO",
    //             name: "Takprodukter"
    //           }),
    //           createCategory({
    //             categoryType: "Category",
    //             code: "TILES_STEELROOF_NO",
    //             name: "Ståltak produkter"
    //           }),
    //           createCategory({
    //             categoryType: "Category",
    //             code: "PITCHEDROOF_NO",
    //             name: "Skråtak"
    //           })
    //         ];
    //         baseProduct.classifications = [
    //           createClassification({
    //             code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
    //             features: [
    //               createFeature({
    //                 code: "measurements.length",
    //                 name: "length",
    //                 featureValues: [{ value: "100", code: "100" }]
    //               })
    //             ]
    //           }),
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.width",
    //                 name: "width",
    //                 featureValues: [{ value: "200", code: "200" }]
    //               })
    //             ]
    //           })
    //         ];

    //         const baseProduct2 = createProduct();
    //         baseProduct2.categories = [
    //           createCategory({
    //             categoryType: "Category",
    //             code: "MAINTILE_STEELROOF_NO",
    //             name: "Takpanne stål"
    //           }),
    //           createCategory({
    //             categoryType: "Category",
    //             code: "PRODUCTS_NO",
    //             name: "Produkter"
    //           }),
    //           createCategory({
    //             categoryType: "Category",
    //             code: "ROOF_NO",
    //             name: "Takprodukter"
    //           }),
    //           createCategory({
    //             categoryType: "Category",
    //             code: "TILES_STEELROOF_NO",
    //             name: "Ståltak produkter"
    //           }),
    //           createCategory({
    //             categoryType: "Category",
    //             code: "PITCHEDROOF_NO",
    //             name: "Skråtak"
    //           })
    //         ];
    //         baseProduct2.classifications = [
    //           createClassification({
    //             code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
    //             features: [
    //               createFeature({
    //                 code: "measurements.length",
    //                 name: "length",
    //                 featureValues: [{ value: "100", code: "100" }]
    //               })
    //             ]
    //           }),
    //           createClassification({
    //             code: ClassificationCodeEnum.MEASUREMENTS,
    //             features: [
    //               createFeature({
    //                 code: "measurements.width",
    //                 name: "width",
    //                 featureValues: [{ value: "300", code: "300" }]
    //               })
    //             ]
    //           })
    //         ];

    //         //example order1
    //         const result1 = getPlpFilters({
    //           pimClassificationNamespace: "",
    //           products: [baseProduct, baseProduct2],
    //           allowedFilters: [
    //             "measurements.length",
    //             "measurements.width",
    //             "Category"
    //           ]
    //         });
    //         expect(result1).toStrictEqual([
    //           {
    //             name: "measurements.length",
    //             label: "length",
    //             options: [
    //               {
    //                 label: "100 classification-feature-feature-unit-symbol",
    //                 value: "100classification-feature-feature-unit-symbol",
    //                 sortValue: 100
    //               }
    //             ],
    //             value: []
    //           },
    //           {
    //             name: "measurements.width",
    //             label: "width",
    //             options: [
    //               {
    //                 label: "200 classification-feature-feature-unit-symbol",
    //                 value: "200classification-feature-feature-unit-symbol",
    //                 sortValue: 200
    //               },
    //               {
    //                 label: "300 classification-feature-feature-unit-symbol",
    //                 value: "300classification-feature-feature-unit-symbol",
    //                 sortValue: 300
    //               }
    //             ],
    //             value: []
    //           },
    //           {
    //             name: "filterLabels.Category",
    //             label: "",
    //             options: [
    //               { label: "Produkter", value: "PRODUCTS_NO" },
    //               { label: "Skråtak", value: "PITCHEDROOF_NO" },
    //               { label: "Ståltak produkter", value: "TILES_STEELROOF_NO" },
    //               { label: "Takpanne stål", value: "MAINTILE_STEELROOF_NO" },
    //               { label: "Takprodukter", value: "ROOF_NO" }
    //             ],
    //             value: []
    //           }
    //         ]);

    //         //order by different order
    //         const result2 = getPlpFilters({
    //           pimClassificationNamespace: "",
    //           products: [baseProduct, baseProduct2],
    //           allowedFilters: [
    //             "measurements.width",
    //             "Category",
    //             "measurements.length"
    //           ]
    //         });
    //         expect(result2).toStrictEqual([
    //           {
    //             name: "measurements.width",
    //             label: "width",
    //             options: [
    //               {
    //                 label: "200 classification-feature-feature-unit-symbol",
    //                 value: "200classification-feature-feature-unit-symbol",
    //                 sortValue: 200
    //               },
    //               {
    //                 label: "300 classification-feature-feature-unit-symbol",
    //                 value: "300classification-feature-feature-unit-symbol",
    //                 sortValue: 300
    //               }
    //             ],
    //             value: []
    //           },
    //           {
    //             name: "filterLabels.Category",
    //             label: "",
    //             options: [
    //               { label: "Produkter", value: "PRODUCTS_NO" },
    //               { label: "Skråtak", value: "PITCHEDROOF_NO" },
    //               { label: "Ståltak produkter", value: "TILES_STEELROOF_NO" },
    //               { label: "Takpanne stål", value: "MAINTILE_STEELROOF_NO" },
    //               { label: "Takprodukter", value: "ROOF_NO" }
    //             ],
    //             value: []
    //           },
    //           {
    //             name: "measurements.length",
    //             label: "length",
    //             options: [
    //               {
    //                 label: "100 classification-feature-feature-unit-symbol",
    //                 value: "100classification-feature-feature-unit-symbol",
    //                 sortValue: 100
    //               }
    //             ],
    //             value: []
    //           }
    //         ]);
    //       });
    //     });
    //   });
    // });
  });
});
