import createCategory from "../../__tests__/CategoryHelper";
import { createFeature } from "../../__tests__/ClassificationHelper";
import {
  generateCategoryFilters,
  groupDistinctBy,
  generateFeatureFilters,
  ProductFilter,
  removePLPFilterPrefix,
  groupBy,
  IndexedItemGroup
} from "../product-filters";

type ImageItem = {
  name: string;
  type: "jpg" | "gif" | "svg";
  brand: string;
};

describe("product-filters tests", () => {
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
  describe("removePLPFilterPrefix tests", () => {
    it("When null value is passed ", () => {
      const result = removePLPFilterPrefix(null);
      expect(result).toEqual("");
    });
    it("When undefined value is passed ", () => {
      const result = removePLPFilterPrefix(undefined);
      expect(result).toEqual("");
    });
    it("When string without any 'plpFilter.' prefix is passed ", () => {
      const result = removePLPFilterPrefix("test");
      expect(result).toEqual("test");
    });
    it("When string with 'plpFilter.' prefix is passed ", () => {
      const result = removePLPFilterPrefix("plpFilter.TEST_VALUE");
      expect(result).toEqual("TEST_VALUE");
    });
  });

  describe("groupDistinctBy tests", () => {
    describe("When empty collection is passed ", () => {
      it("returns empty object", () => {
        const result = groupDistinctBy([], "categoryType", "code");
        expect(result).toEqual({});
      });
    });
    describe("When null collection is passed ", () => {
      it("returns empty object", () => {
        const result = groupDistinctBy([], "categoryType", "code");
        expect(result).toEqual({});
      });
    });

    describe("When NO duplicate distinct by value exists", () => {
      it("returns grouped objects by given property key", () => {
        const categories = [
          {
            name: "AeroDeck_2",
            categoryType: "Brand",
            code: "AeroDeck_2"
          },
          {
            categoryType: "Brand",
            code: "AeroDeck",
            name: "AeroDeck"
          },
          {
            name: "category_1",
            categoryType: "Category",
            code: "category_1"
          },
          {
            categoryType: "Category",
            code: "category_2",
            name: "category_2"
          }
        ];
        const result = groupDistinctBy(categories, "categoryType", "code");
        expect(result).toEqual({
          Brand: [
            { name: "AeroDeck_2", categoryType: "Brand", code: "AeroDeck_2" },
            { categoryType: "Brand", code: "AeroDeck", name: "AeroDeck" }
          ],
          Category: [
            {
              name: "category_1",
              categoryType: "Category",
              code: "category_1"
            },
            { categoryType: "Category", code: "category_2", name: "category_2" }
          ]
        });
      });
    });

    describe("When duplicate distinct by value exists", () => {
      it("returns grouped objects with distinct values by given distinct by property key", () => {
        const categories = [
          {
            name: "AeroDeck",
            categoryType: "Brand",
            code: "AeroDeck"
          },
          {
            categoryType: "Brand",
            code: "AeroDeck",
            name: "AeroDeck"
          }
        ];
        const result = groupDistinctBy(categories, "categoryType", "code");
        expect(result).toEqual({
          Brand: [{ name: "AeroDeck", categoryType: "Brand", code: "AeroDeck" }]
        });
      });
    });
    describe("When duplicate distinct exists in different groups", () => {
      it("returns grouped objects with distinct values by given distinct by property key", () => {
        const categories = [
          {
            name: "AeroDeck",
            categoryType: "Category",
            code: "AeroDeck"
          },
          {
            categoryType: "Brand",
            code: "AeroDeck",
            name: "AeroDeck"
          }
        ];
        const result = groupDistinctBy(categories, "categoryType", "code");
        expect(result).toEqual({
          Brand: [
            { name: "AeroDeck", categoryType: "Brand", code: "AeroDeck" }
          ],
          Category: [
            { name: "AeroDeck", categoryType: "Category", code: "AeroDeck" }
          ]
        });
      });
    });
  });

  describe("generateCategoryFilters tests", () => {
    describe("When categories and allowed filters are not pased", () => {
      it("should return empty productFilters", () => {
        expect(generateCategoryFilters()).toEqual([]);
      });
    });
    describe("When categories are empty array", () => {
      it("should return empty productFilters", () => {
        expect(generateCategoryFilters([], ["Category"])).toEqual([]);
      });
    });
    describe("When allow filters are empty array", () => {
      it("should return empty productFilters", () => {
        expect(generateCategoryFilters([createCategory()], [])).toEqual([]);
      });
    });

    describe("When categories have valid categories list", () => {
      describe("and allow filters does not match", () => {
        it("should return empty productFilters", () => {
          expect(
            generateCategoryFilters([createCategory()], ["invalid-category"])
          ).toEqual([]);
        });
      });
      describe("and allow filters match catgoryType", () => {
        it("should return valid filters", () => {
          expect(
            generateCategoryFilters(
              [
                createCategory({
                  categoryType: "Category",
                  code: "category-1",
                  name: "category-1"
                }),
                createCategory({
                  categoryType: "Category",
                  code: "category-2",
                  name: "category-2"
                })
              ],
              ["Category"]
            )
          ).toEqual([
            {
              name: "plpFilter.Category",
              label: "",
              value: [],
              options: [
                { label: "category-1", value: "category-1" },
                { label: "category-2", value: "category-2" }
              ]
            }
          ]);
        });
        it("should return filters in alphabetical order", () => {
          expect(
            generateCategoryFilters(
              [
                createCategory({
                  categoryType: "Category",
                  code: "category-a",
                  name: "category-a"
                }),
                createCategory({
                  categoryType: "Category",
                  code: "category-z",
                  name: "category-z"
                })
              ],
              ["Category"]
            )
          ).toEqual([
            {
              name: "plpFilter.Category",
              label: "",
              value: [],
              options: [
                {
                  label: "category-a",
                  value: "category-a"
                },
                {
                  label: "category-z",
                  value: "category-z"
                }
              ]
            }
          ]);
        });
      });
      describe("and allow filters match catgoryType with Pipe", () => {
        it("should return valid filters", () => {
          expect(
            generateCategoryFilters(
              [
                createCategory({
                  categoryType: "Category",
                  code: "category-1",
                  name: "category-1"
                }),
                createCategory({
                  categoryType: "Category",
                  code: "category-2",
                  name: "category-2"
                })
              ],
              ["Category | category-2"]
            )
          ).toEqual([
            {
              name: "plpFilter.Category",
              label: "",
              value: [],
              options: [{ label: "category-2", value: "category-2" }]
            }
          ]);
        });
      });
      describe("and allow filters match parent catgory code", () => {
        it("should return valid filters", () => {
          expect(
            generateCategoryFilters(
              [
                createCategory({
                  categoryType: "Category",
                  code: "category-1",
                  name: "category-1",
                  parentCategoryCode: "PITCHROOF_NO"
                }),
                createCategory({
                  categoryType: "Category",
                  code: "category-2",
                  name: "category-2",
                  parentCategoryCode: "PITCHROOF_NO"
                })
              ],
              ["PITCHROOF_NO"]
            )
          ).toEqual([
            {
              name: "plpFilter.PITCHROOF_NO",
              label: "",
              value: [],
              options: [
                { label: "category-1", value: "category-1" },
                { label: "category-2", value: "category-2" }
              ]
            }
          ]);
        });
      });
      describe("and allow filters match Category Type and Parent catgory code", () => {
        it("should return valid filters", () => {
          expect(
            generateCategoryFilters(
              [
                createCategory({
                  categoryType: "Category",
                  code: "category-1",
                  name: "category-1",
                  parentCategoryCode: "PITCHROOF_NO"
                }),
                createCategory({
                  categoryType: "Category",
                  code: "category-2",
                  name: "category-2",
                  parentCategoryCode: "PITCHROOF_NO"
                })
              ],
              ["PITCHROOF_NO", "Category"]
            )
          ).toEqual([
            {
              name: "plpFilter.Category",
              label: "",
              value: [],
              options: [
                { label: "category-1", value: "category-1" },
                { label: "category-2", value: "category-2" }
              ]
            },
            {
              name: "plpFilter.PITCHROOF_NO",
              label: "",
              value: [],
              options: [
                { label: "category-1", value: "category-1" },
                { label: "category-2", value: "category-2" }
              ]
            }
          ]);
        });
      });
    });
  });

  describe("generateClassificationFeatureFilters tests", () => {
    describe("When allowFilters is not passed", () => {
      it("should return empty productFilters", () => {
        expect(generateFeatureFilters("")).toEqual([]);
      });
    });
    describe("When allowFilters is emtpy array", () => {
      it("should return empty productFilters", () => {
        expect(generateFeatureFilters("", [createFeature()], [])).toEqual([]);
      });
    });

    describe("When allowFilters criteria is NOT emtpy array", () => {
      describe("classification features are null", () => {
        it("should return empty productFilters", () => {
          expect(
            generateFeatureFilters("", null, [
              "some-filter-category",
              "feature-1"
            ])
          ).toEqual([]);
        });
      });
      describe("And None of the filterBy criteria match classification features", () => {
        it("should return empty productFilters", () => {
          expect(
            generateFeatureFilters(
              "",
              [createFeature()],
              ["some-filter-category", "feature-1"]
            )
          ).toEqual([]);
        });
      });

      describe("And single classification with multiple features are passed", () => {
        describe("And some of the filterBy criteria match feature codes", () => {
          describe("And feature has values", () => {
            it("returns matching filters", () => {
              const result: ProductFilter[] = generateFeatureFilters(
                "",
                [
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  })
                ],
                ["roofAttributes.minimumpitch"]
              );
              expect(result).toEqual([
                {
                  name: "roofAttributes.minimumpitch",
                  label: "minimumpitch",
                  value: [],
                  options: [
                    {
                      label: "8 °",
                      value: "8°",
                      sortValue: 8
                    },
                    {
                      label: "9 °",
                      value: "9°",
                      sortValue: 9
                    }
                  ]
                }
              ]);
            });
          });
          describe("And feature has NO values", () => {
            it("returns no filters", () => {
              const result: ProductFilter[] = generateFeatureFilters(
                "",
                [
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    featureValues: [],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  })
                ],
                ["roofAttributes.minimumpitch"]
              );
              expect(result).toEqual([]);
            });
          });
          describe("And feature code but has no feature unit", () => {
            it("returns matching filters", () => {
              const result: ProductFilter[] = generateFeatureFilters(
                "",
                [
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: undefined
                  })
                ],
                ["roofAttributes.minimumpitch"]
              );
              expect(result).toEqual([
                {
                  name: "roofAttributes.minimumpitch",
                  label: "minimumpitch",
                  value: [],
                  options: [
                    {
                      label: "8",
                      value: "8",
                      sortValue: 8
                    },
                    {
                      label: "9",
                      value: "9",
                      sortValue: 9
                    }
                  ]
                }
              ]);
            });
          });
          describe("And feature has no code and no feature unit", () => {
            it("returns matching filters", () => {
              const result: ProductFilter[] = generateFeatureFilters(
                "",
                [
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: undefined, value: "8" }],
                    featureUnit: undefined
                  }),
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: undefined, value: "9" }],
                    featureUnit: undefined
                  })
                ],
                ["roofAttributes.minimumpitch"]
              );
              expect(result).toEqual([
                {
                  name: "roofAttributes.minimumpitch",
                  label: "minimumpitch",
                  value: [],
                  options: [
                    {
                      label: "8",
                      value: "8",
                      sortValue: 8
                    },
                    {
                      label: "9",
                      value: "9",
                      sortValue: 9
                    }
                  ]
                }
              ]);
            });
          });
        });
      });

      describe("And Multiple classification is passed with multiple features", () => {
        describe("And some of the filterBy criteria match feature codes", () => {
          describe("And feature does not have featureUnit", () => {
            describe("And all feature values are numeric", () => {
              it("returns matching filters in numerical order", () => {
                const result = generateFeatureFilters(
                  "",
                  [
                    createFeature({
                      code: "roofAttributes.minimumpitch",
                      name: "minimumpitch",
                      featureValues: [{ code: "8", value: "8" }]
                    }),
                    createFeature({
                      code: "roofAttributes.minimumpitch",
                      name: "minimumpitch",
                      featureValues: [{ code: "9", value: "9" }]
                    }),
                    createFeature({
                      code: "roofAttributes.minimumpitch",
                      name: "minimumpitch",
                      featureValues: [{ code: "10", value: "10" }]
                    }),
                    createFeature({
                      code: "roofAttributes.minimumpitch",
                      name: "minimumpitch",
                      featureValues: [{ code: "8", value: "8" }]
                    }),
                    createFeature({
                      code: "roofAttributes.minimumpitch",
                      name: "minimumpitch",
                      featureValues: [{ code: "9", value: "9" }]
                    })
                  ],
                  ["roofAttributes.minimumpitch"]
                );

                expect(result).toEqual([
                  {
                    name: "roofAttributes.minimumpitch",
                    label: "minimumpitch",
                    value: [],
                    options: [
                      {
                        label: "8 classification-feature-feature-unit-symbol",
                        value: "8classification-feature-feature-unit-symbol",
                        sortValue: 8
                      },
                      {
                        label: "9 classification-feature-feature-unit-symbol",
                        value: "9classification-feature-feature-unit-symbol",
                        sortValue: 9
                      },
                      {
                        label: "10 classification-feature-feature-unit-symbol",
                        value: "10classification-feature-feature-unit-symbol",
                        sortValue: 10
                      }
                    ]
                  }
                ]);
              });
            });
            describe("And all feature values are Aphabetic", () => {
              it("returns matching filters in alphabetic order", () => {
                const result = generateFeatureFilters(
                  "",
                  [
                    createFeature({
                      code: "roofAttributes.color",
                      name: "color",
                      featureValues: [{ code: "green", value: "green" }]
                    }),
                    createFeature({
                      code: "roofAttributes.color",
                      name: "color",
                      featureValues: [{ code: "red", value: "red" }]
                    }),
                    createFeature({
                      code: "roofAttributes.color",
                      name: "color",
                      featureValues: [{ code: "blue", value: "blue" }]
                    }),
                    createFeature({
                      code: "roofAttributes.color",
                      name: "color",
                      featureValues: [{ code: "white", value: "white" }]
                    }),
                    createFeature({
                      code: "roofAttributes.color",
                      name: "color",
                      featureValues: [{ code: "amber", value: "amber" }]
                    })
                  ],
                  ["roofAttributes.color"]
                );
                expect(result).toEqual([
                  {
                    name: "roofAttributes.color",
                    label: "color",
                    value: [],
                    options: [
                      {
                        label:
                          "amber classification-feature-feature-unit-symbol",
                        value:
                          "amberclassification-feature-feature-unit-symbol",
                        sortValue: "amber"
                      },
                      {
                        label:
                          "blue classification-feature-feature-unit-symbol",
                        value: "blueclassification-feature-feature-unit-symbol",
                        sortValue: "blue"
                      },
                      {
                        label:
                          "green classification-feature-feature-unit-symbol",
                        value:
                          "greenclassification-feature-feature-unit-symbol",
                        sortValue: "green"
                      },
                      {
                        label: "red classification-feature-feature-unit-symbol",
                        value: "redclassification-feature-feature-unit-symbol",
                        sortValue: "red"
                      },
                      {
                        label:
                          "white classification-feature-feature-unit-symbol",
                        value:
                          "whiteclassification-feature-feature-unit-symbol",
                        sortValue: "white"
                      }
                    ]
                  }
                ]);
              });
            });
          });

          describe("And feature has featureUnit", () => {
            it("returns matching unique filters", () => {
              const result = generateFeatureFilters(
                "",
                [
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "10", value: "10" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  })
                ],
                [
                  "Category",
                  "Category | MAINTILE_STEELROOF_NO",
                  "roofAttributes.minimumpitch"
                ]
              );
              expect(result).toEqual([
                {
                  name: "roofAttributes.minimumpitch",
                  label: "minimumpitch",
                  value: [],
                  options: [
                    {
                      label: "8 °",
                      value: "8°",
                      sortValue: 8
                    },
                    {
                      label: "9 °",
                      value: "9°",
                      sortValue: 9
                    },
                    {
                      label: "10 °",
                      value: "10°",
                      sortValue: 10
                    }
                  ]
                }
              ]);
            });
          });
        });
      });

      describe("With pim classification namespace prefix", () => {
        describe("And Multiple classification is passed with multiple features", () => {
          describe("And some of the filterBy criteria match feature codes", () => {
            it("returns matching unique filters", () => {
              const result = generateFeatureFilters(
                "pim-classification-namespace",
                [
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "10", value: "10" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    name: "minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  })
                ],
                ["roofAttributes.minimumpitch", "roofAttributes.maximumpitch"]
              );
              expect(result).toEqual([
                {
                  name: "roofAttributes.minimumpitch",
                  label: "minimumpitch",
                  value: [],
                  options: [
                    {
                      label: "8 °",
                      value: "8°",
                      sortValue: 8
                    },
                    {
                      label: "9 °",
                      value: "9°",
                      sortValue: 9
                    },
                    {
                      label: "10 °",
                      value: "10°",
                      sortValue: 10
                    }
                  ]
                }
              ]);
            });
          });
          describe("And None of the filterBy criteria match feature codes", () => {
            it("returns empty filters", () => {
              const result = generateFeatureFilters(
                "pim-classification-namespace",
                [
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "10", value: "10" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  })
                ],
                ["colorAttributes.color", "roofAttributes.maximumpitch"]
              );
              expect(result).toEqual([]);
            });
          });
          describe("And filterBy criteria is invalid", () => {
            it("returns empty filters", () => {
              const result = generateFeatureFilters(
                "pim-classification-namespace",
                [
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "10", value: "10" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "8", value: "8" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  }),
                  createFeature({
                    code: "pim-classification-namespace/roofAttributes.minimumpitch",
                    featureValues: [{ code: "9", value: "9" }],
                    featureUnit: {
                      name: "degree",
                      symbol: "°",
                      unitType: "slope"
                    }
                  })
                ],
                ["invalid.invalid", "invalidAttributes.invalid"]
              );
              expect(result).toEqual([]);
            });
          });
        });
      });
    });
  });
});
