import createCategory from "../../__tests__/CategoryHelper";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";
import {
  generateCategoryFilters,
  groupDistinctBy,
  generateFeatureFilters,
  ProductFilter
} from "../product-filters";

describe("product-filters tests", () => {
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
              options: [
                { label: "category-1", value: "category-1" },
                { label: "category-2", value: "category-2" }
              ]
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
              options: [
                { label: "category-1", value: "category-1" },
                { label: "category-2", value: "category-2" }
              ]
            },
            {
              name: "plpFilter.PITCHROOF_NO",
              label: "",
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
    describe("When allowFilters is emtpy array", () => {
      it("should return empty productFilters", () => {
        expect(
          generateFeatureFilters("", [createClassification()], [])
        ).toEqual([]);
      });
    });

    describe("When allowFilters criteria is NOT emtpy array", () => {
      describe("classification features are null", () => {
        it("should return empty productFilters", () => {
          expect(
            generateFeatureFilters(
              "",
              [createClassification({ features: null })],
              ["some-filter-category", "feature-1"]
            )
          ).toEqual([]);
        });
      });
      describe("And None of the filterBy criteria match classification features", () => {
        it("should return empty productFilters", () => {
          expect(
            generateFeatureFilters(
              "",
              [createClassification()],
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
                  createClassification({
                    features: [
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
                    ]
                  })
                ],
                ["roofAttributes.minimumpitch"]
              );
              expect(result).toEqual([
                {
                  name: "roofAttributes.minimumpitch",
                  label: "minimumpitch",
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
                  createClassification({
                    features: [
                      createFeature({
                        code: "roofAttributes.minimumpitch",
                        featureValues: [],
                        featureUnit: {
                          name: "degree",
                          symbol: "°",
                          unitType: "slope"
                        }
                      }),
                      createFeature({
                        code: "roofAttributes.minimumpitch",
                        featureValues: [],
                        featureUnit: {
                          name: "degree",
                          symbol: "°",
                          unitType: "slope"
                        }
                      })
                    ]
                  })
                ],
                ["roofAttributes.minimumpitch"]
              );
              expect(result).toEqual([]);
            });
          });
        });
      });

      describe("And Multiple classification is passed with multiple features", () => {
        describe("And some of the filterBy criteria match feature codes", () => {
          it("returns matching unique filters", () => {
            const result = generateFeatureFilters(
              "",
              [
                createClassification({
                  features: [
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
                  ]
                }),
                createClassification({
                  features: [
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
                  ]
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

      describe("With pim classification namespace prefix", () => {
        describe("And Multiple classification is passed with multiple features", () => {
          describe("And some of the filterBy criteria match feature codes", () => {
            it("returns matching unique filters", () => {
              const result = generateFeatureFilters(
                "pim-classification-namespace",
                [
                  createClassification({
                    features: [
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
                    ]
                  }),
                  createClassification({
                    features: [
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
                    ]
                  })
                ],
                ["roofAttributes.minimumpitch", "roofAttributes.maximumpitch"]
              );
              expect(result).toEqual([
                {
                  name: "roofAttributes.minimumpitch",
                  label: "minimumpitch",
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
                  createClassification({
                    features: [
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
                    ]
                  }),
                  createClassification({
                    features: [
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
                    ]
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
                  createClassification({
                    features: [
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
                    ]
                  }),
                  createClassification({
                    features: [
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
                    ]
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
