import { ProductFilter } from "../../types/pim";
import { createFirestoreFilter } from "../../__tests__/helpers/filterHelper";
import { generateFilters } from "../product-filters";

describe("product-filters geterateFilters tests", () => {
  describe("CategoryFilters tests", () => {
    describe("When categories and allowed filters are not pased", () => {
      it("should return empty productFilters", () => {
        expect(generateFilters()).toEqual([]);
      });
    });

    describe("When firestore filters are null", () => {
      it("should return empty productFilters", () => {
        const allowedFilters = new Map<string, string[]>();
        expect(generateFilters(null, allowedFilters, allowedFilters)).toEqual(
          []
        );
      });
    });

    describe("When categories and feature filters are null", () => {
      it("should return empty productFilters", () => {
        expect(generateFilters([], null, null)).toEqual([]);
      });
    });
    describe("When categories are empty array", () => {
      it("should return empty productFilters", () => {
        const categoryFilter = new Map<string, string[]>();
        categoryFilter.set("Category", []);
        expect(generateFilters([], categoryFilter, null)).toEqual([]);
      });
    });

    describe("When allow filters are empty array", () => {
      it("should return empty productFilters", () => {
        const categoryFilter = new Map<string, string[]>();
        const classFilter = new Map<string, string[]>();
        expect(
          generateFilters(
            [createFirestoreFilter()],
            categoryFilter,
            classFilter
          )
        ).toEqual([]);
      });
    });

    describe("When categories have valid categories list", () => {
      describe("and allow filters does not match", () => {
        it("should return empty productFilters", () => {
          const categoryFilter = new Map<string, string[]>();
          categoryFilter.set("invalid-category", []);
          const classFilter = new Map<string, string[]>();
          expect(
            generateFilters(
              [createFirestoreFilter()],
              categoryFilter,
              classFilter
            )
          ).toEqual([]);
        });
      });

      describe("and allow filters match catgoryType", () => {
        it("should return valid filters", () => {
          const categoryFilter = new Map<string, string[]>();
          categoryFilter.set("Category", []);
          const classFilter = new Map<string, string[]>();
          expect(
            generateFilters(
              [
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-1",
                  name: "category-1"
                }),
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-2",
                  name: "category-2"
                })
              ],
              categoryFilter,
              classFilter
            )
          ).toEqual([
            {
              filterCode: "Category",
              name: "Category",
              label: "filterLabels.Category",
              value: [],
              options: [
                {
                  label: "category-1",
                  value: "category-1",
                  sortValue: "category-1"
                },
                {
                  label: "category-2",
                  value: "category-2",
                  sortValue: "category-2"
                }
              ]
            }
          ]);
        });
        it("should return filters in alphabetical order", () => {
          const categoryFilter = new Map<string, string[]>();
          categoryFilter.set("Category", []);
          const classFilter = new Map<string, string[]>();
          expect(
            generateFilters(
              [
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-a",
                  name: "category-a"
                }),
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-z",
                  name: "category-z"
                })
              ],
              categoryFilter,
              classFilter
            )
          ).toEqual([
            {
              filterCode: "Category",
              name: "Category",
              label: "filterLabels.Category",
              value: [],
              options: [
                {
                  label: "category-a",
                  value: "category-a",
                  sortValue: "category-a"
                },
                {
                  label: "category-z",
                  value: "category-z",
                  sortValue: "category-z"
                }
              ]
            }
          ]);
        });
      });

      describe("and allow filters match catgoryType with Pipe", () => {
        it("should return valid filters", () => {
          const categoryFilter = new Map<string, string[]>();
          categoryFilter.set("Category", ["category-2"]);
          const classFilter = new Map<string, string[]>();
          expect(
            generateFilters(
              [
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-1",
                  name: "category-1"
                }),
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-2",
                  name: "category-2"
                })
              ],
              categoryFilter,
              classFilter
            )
          ).toEqual([
            {
              filterCode: "Category",
              name: "Category",
              label: "filterLabels.Category",
              value: [],
              options: [
                {
                  label: "category-2",
                  value: "category-2",
                  sortValue: "category-2"
                }
              ]
            }
          ]);
        });
      });

      describe("and allow filters match parent catgory code", () => {
        it("should return valid filters", () => {
          const categoryFilter = new Map<string, string[]>();
          categoryFilter.set("PITCHROOF_NO", []);
          const classFilter = new Map<string, string[]>();
          expect(
            generateFilters(
              [
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-1",
                  name: "category-1",
                  parentFilterCode: "PITCHROOF_NO"
                }),
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-2",
                  name: "category-2",
                  parentFilterCode: "PITCHROOF_NO"
                })
              ],
              categoryFilter,
              classFilter
            )
          ).toEqual([
            {
              filterCode: "PITCHROOF_NO",
              name: "PITCHROOF_NO",
              label: "filterLabels.PITCHROOF_NO",
              value: [],
              options: [
                {
                  label: "category-1",
                  value: "category-1",
                  sortValue: "category-1"
                },
                {
                  label: "category-2",
                  value: "category-2",
                  sortValue: "category-2"
                }
              ]
            }
          ]);
        });
      });

      describe("and allow filters match Category Type and Parent catgory code", () => {
        it("should return valid filters", () => {
          const categoryFilter = new Map<string, string[]>();
          categoryFilter.set("PITCHROOF_NO", []);
          categoryFilter.set("Category", []);
          const classFilter = new Map<string, string[]>();
          expect(
            generateFilters(
              [
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-1",
                  name: "category-1",
                  parentFilterCode: "PITCHROOF_NO"
                }),
                createFirestoreFilter({
                  filterCode: "Category",
                  code: "category-2",
                  name: "category-2",
                  parentFilterCode: "PITCHROOF_NO"
                })
              ],
              categoryFilter,
              classFilter
            )
          ).toEqual([
            {
              filterCode: "Category",
              name: "Category",
              label: "filterLabels.Category",
              value: [],
              options: [
                {
                  label: "category-1",
                  value: "category-1",

                  sortValue: "category-1"
                },
                {
                  label: "category-2",
                  value: "category-2",

                  sortValue: "category-2"
                }
              ]
            },
            {
              filterCode: "PITCHROOF_NO",
              name: "PITCHROOF_NO",
              label: "filterLabels.PITCHROOF_NO",
              value: [],
              options: [
                {
                  label: "category-1",
                  value: "category-1",
                  sortValue: "category-1"
                },
                {
                  label: "category-2",
                  value: "category-2",
                  sortValue: "category-2"
                }
              ]
            }
          ]);
        });
        describe("and filter code is undefined", () => {
          it("should return filter out invalid firestore category", () => {
            const categoryFilter = new Map<string, string[]>();
            categoryFilter.set("PITCHROOF_NO", []);
            categoryFilter.set("Category", []);
            const classFilter = new Map<string, string[]>();
            expect(
              generateFilters(
                [
                  createFirestoreFilter({
                    filterCode: "Category",
                    code: null,
                    name: "category-1",
                    parentFilterCode: ""
                  }),
                  createFirestoreFilter({
                    filterCode: "Category",
                    code: "category-2",
                    name: "category-2",
                    parentFilterCode: "PITCHROOF_NO"
                  })
                ],
                categoryFilter,
                classFilter
              )
            ).toEqual([
              {
                filterCode: "Category",
                name: "Category",
                label: "filterLabels.Category",
                value: [],
                options: [
                  {
                    label: "category-1",
                    value: "",
                    sortValue: "category-1"
                  },
                  {
                    label: "category-2",
                    value: "category-2",

                    sortValue: "category-2"
                  }
                ]
              },
              {
                filterCode: "PITCHROOF_NO",
                name: "PITCHROOF_NO",
                label: "filterLabels.PITCHROOF_NO",
                value: [],
                options: [
                  {
                    label: "category-2",
                    value: "category-2",
                    sortValue: "category-2"
                  }
                ]
              }
            ]);
          });
        });
      });
    });
  });

  describe("ClassificationFeatureFilters tests", () => {
    describe("When allowFilters is not passed", () => {
      it("should return empty productFilters", () => {
        expect(generateFilters()).toEqual([]);
      });
    });

    describe("When allowFilters is emtpy array", () => {
      it("should return empty productFilters", () => {
        const classFilter = new Map<string, string[]>();
        expect(
          generateFilters(
            [createFirestoreFilter({ isCategory: false })],
            null,
            classFilter
          )
        ).toEqual([]);
      });
    });

    describe("When allowFilters criteria is NOT emtpy array", () => {
      describe("classification features are null", () => {
        it("should return empty productFilters", () => {
          const categoryFilter = new Map<string, string[]>();
          categoryFilter.set("some-filter-category", []);
          const classFilter = new Map<string, string[]>();
          classFilter.set("feature-1", []);
          expect(generateFilters(null, categoryFilter, classFilter)).toEqual(
            []
          );
        });
      });

      describe("And None of the filterBy criteria match classification features", () => {
        it("should return empty productFilters", () => {
          const categoryFilter = new Map<string, string[]>();
          categoryFilter.set("some-filter-category", []);
          const classFilter = new Map<string, string[]>();
          classFilter.set("feature-1", []);
          expect(
            generateFilters(
              [createFirestoreFilter({ isCategory: false })],
              categoryFilter,
              classFilter
            )
          ).toEqual([]);
        });
      });

      describe("And single classification with multiple features are passed", () => {
        describe("And some of the filterBy criteria match feature codes", () => {
          describe("And feature has values", () => {
            it("returns matching filters", () => {
              const categoryFilter = new Map<string, string[]>();
              const classFilter = new Map<string, string[]>();
              classFilter.set("roofattributes.minimumpitch", []);
              const result: ProductFilter[] = generateFilters(
                [
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "",
                    name: "minimumpitch",
                    value: "8",
                    unit: "°",
                    groupLabel: "minimumpitch",
                    isCategory: false
                  }),
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "",
                    name: "minimumpitch",
                    value: "9",
                    unit: "°",
                    groupLabel: "minimumpitch",
                    isCategory: false
                  })
                ],
                categoryFilter,
                classFilter
              );
              expect(result).toEqual([
                {
                  filterCode: "roofAttributes.minimumpitch",
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
          //TODO: check with Ben, if this case is possible now?
          // or if the classificiations without any values can be filtered out in firestore xform
          // describe("And feature has NO values", () => {
          //   it("returns no filters", () => {
          //     const result: ProductFilter[] = generateFilters(
          //       [
          //         createFilter({
          //           filterCode: "roofAttributes.minimumpitch",
          //           code: "roofAttributes.minimumpitch",
          //           unit: "°"
          //         })
          //       ],
          //       ["roofAttributes.minimumpitch"]
          //     );
          //     expect(result).toEqual([]);
          //   });
          // });

          describe("And feature code but has no feature unit", () => {
            it("returns matching filters", () => {
              const categoryFilter = new Map<string, string[]>();
              const classFilter = new Map<string, string[]>();
              classFilter.set("roofattributes.minimumpitch", []);
              const result: ProductFilter[] = generateFilters(
                [
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "",
                    groupLabel: "minimumpitch",
                    name: "minimumpitch",
                    value: "8",
                    unit: undefined,
                    isCategory: false
                  }),
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "",
                    groupLabel: "minimumpitch",
                    name: "minimumpitch",
                    value: "9",
                    unit: undefined,
                    isCategory: false
                  })
                ],
                categoryFilter,
                classFilter
              );
              expect(result).toEqual([
                {
                  filterCode: "roofAttributes.minimumpitch",
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
              const categoryFilter = new Map<string, string[]>();
              const classFilter = new Map<string, string[]>();
              classFilter.set("roofattributes.minimumpitch", []);
              const result: ProductFilter[] = generateFilters(
                [
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "",
                    groupLabel: "minimumpitch",
                    name: "minimumpitch",
                    value: "8",
                    unit: undefined,
                    isCategory: false
                  }),
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "",
                    name: "minimumpitch",
                    groupLabel: "minimumpitch",
                    value: "9",
                    unit: undefined,
                    isCategory: false
                  })
                ],
                categoryFilter,
                classFilter
              );
              expect(result).toEqual([
                {
                  filterCode: "roofAttributes.minimumpitch",
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
                const categoryFilter = new Map<string, string[]>();
                const classFilter = new Map<string, string[]>();
                classFilter.set("roofattributes.minimumpitch", []);
                const result = generateFilters(
                  [
                    createFirestoreFilter({
                      filterCode: "roofAttributes.minimumpitch",
                      code: "",
                      name: "minimumpitch",
                      groupLabel: "minimumpitch",
                      value: "8",
                      isCategory: false
                    }),
                    createFirestoreFilter({
                      filterCode: "roofAttributes.minimumpitch",
                      code: "",
                      name: "minimumpitch",
                      groupLabel: "minimumpitch",
                      value: "9",
                      isCategory: false
                    }),
                    createFirestoreFilter({
                      filterCode: "roofAttributes.minimumpitch",
                      code: "",
                      name: "minimumpitch",
                      groupLabel: "minimumpitch",
                      value: "10",
                      isCategory: false
                    }),
                    createFirestoreFilter({
                      filterCode: "roofAttributes.minimumpitch",
                      code: "",
                      name: "minimumpitch",
                      groupLabel: "minimumpitch",
                      value: "8",
                      isCategory: false
                    }),
                    createFirestoreFilter({
                      filterCode: "roofAttributes.minimumpitch",
                      code: "",
                      name: "minimumpitch",
                      groupLabel: "minimumpitch",
                      value: "9",
                      isCategory: false
                    })
                  ],
                  categoryFilter,
                  classFilter
                );

                expect(result).toEqual([
                  {
                    filterCode: "roofAttributes.minimumpitch",
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
                      },
                      {
                        label: "10",
                        value: "10",
                        sortValue: 10
                      }
                    ]
                  }
                ]);
              });
            });

            describe("And all feature values are Aphabetic", () => {
              it("returns matching filters in alphabetic order", () => {
                const categoryFilter = new Map<string, string[]>();
                const classFilter = new Map<string, string[]>();
                classFilter.set("roofattributes.color", []);
                const result = generateFilters(
                  [
                    createFirestoreFilter({
                      filterCode: "roofAttributes.color",
                      code: "green",
                      groupLabel: "color",
                      name: "color",
                      value: "green",
                      isCategory: false
                    }),
                    createFirestoreFilter({
                      filterCode: "roofAttributes.color",
                      code: "red",
                      groupLabel: "color",
                      name: "color",
                      value: "red",
                      isCategory: false
                    }),
                    createFirestoreFilter({
                      filterCode: "roofAttributes.color",
                      code: "blue",
                      groupLabel: "color",
                      name: "color",
                      value: "blue",
                      isCategory: false
                    }),
                    createFirestoreFilter({
                      filterCode: "roofAttributes.color",
                      code: "white",
                      groupLabel: "color",
                      name: "color",
                      value: "white",
                      isCategory: false
                    }),
                    createFirestoreFilter({
                      filterCode: "roofAttributes.color",
                      code: "amber",
                      groupLabel: "color",
                      name: "color",
                      value: "amber",
                      isCategory: false
                    })
                  ],
                  categoryFilter,
                  classFilter
                );
                expect(result).toEqual([
                  {
                    filterCode: "roofAttributes.color",
                    name: "roofAttributes.color",
                    label: "color",
                    value: [],
                    options: [
                      {
                        label: "amber",
                        value: "amber",
                        sortValue: "amber"
                      },
                      {
                        label: "blue",
                        value: "blue",
                        sortValue: "blue"
                      },
                      {
                        label: "green",
                        value: "green",
                        sortValue: "green"
                      },
                      {
                        label: "red",
                        value: "red",
                        sortValue: "red"
                      },
                      {
                        label: "white",
                        value: "white",
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
              const categoryFilter = new Map<string, string[]>();
              categoryFilter.set("Category", ["MAINTILE_STEELROOF_NO"]);
              const classFilter = new Map<string, string[]>();
              classFilter.set("roofattributes.minimumpitch", []);
              const result = generateFilters(
                [
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "8",
                    name: "minimumpitch",
                    groupLabel: "minimumpitch",
                    value: "8",
                    unit: "°",
                    isCategory: false
                  }),
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "9",
                    name: "minimumpitch",
                    groupLabel: "minimumpitch",
                    value: "9",
                    unit: "°",
                    isCategory: false
                  }),
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "10",
                    name: "minimumpitch",
                    groupLabel: "minimumpitch",
                    value: "10",
                    unit: "°",
                    isCategory: false
                  }),
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "8",
                    name: "minimumpitch",
                    groupLabel: "minimumpitch",
                    value: "8",
                    unit: "°",
                    isCategory: false
                  }),
                  createFirestoreFilter({
                    filterCode: "roofAttributes.minimumpitch",
                    code: "9",
                    name: "minimumpitch",
                    groupLabel: "minimumpitch",
                    value: "9",
                    unit: "°",
                    isCategory: false
                  })
                ],
                categoryFilter,
                classFilter
              );
              expect(result).toEqual([
                {
                  filterCode: "roofAttributes.minimumpitch",
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

        describe("And None of the filterBy criteria match feature codes", () => {
          it("returns empty filters", () => {
            const categoryFilter = new Map<string, string[]>();
            const classFilter = new Map<string, string[]>();
            classFilter.set("colorattributes.color", []);
            classFilter.set("roofattributes.maximumpitch", []);
            const result = generateFilters(
              [
                createFirestoreFilter({
                  filterCode: "roofAttributes.minimumpitch",
                  code: "roofAttributes.minimumpitch",
                  name: "minimumpitch",
                  groupLabel: "minimumpitch",
                  value: "8",
                  unit: "°"
                }),
                createFirestoreFilter({
                  filterCode: "roofAttributes.minimumpitch",
                  code: "roofAttributes.minimumpitch",
                  name: "minimumpitch",
                  groupLabel: "minimumpitch",
                  value: "9",
                  unit: "°"
                }),
                createFirestoreFilter({
                  filterCode: "roofAttributes.minimumpitch",
                  code: "roofAttributes.minimumpitch",
                  name: "minimumpitch",
                  groupLabel: "minimumpitch",
                  value: "10",
                  unit: "°"
                }),
                createFirestoreFilter({
                  filterCode: "roofAttributes.minimumpitch",
                  code: "roofAttributes.minimumpitch",
                  name: "minimumpitch",
                  groupLabel: "minimumpitch",
                  value: "8",
                  unit: "°"
                }),
                createFirestoreFilter({
                  filterCode: "roofAttributes.minimumpitch",
                  code: "roofAttributes.minimumpitch",
                  name: "minimumpitch",
                  groupLabel: "minimumpitch",
                  value: "9",
                  unit: "°"
                })
              ],
              categoryFilter,
              classFilter
            );
            expect(result).toEqual([]);
          });
        });
      });

      describe("And filterBy criteria is invalid", () => {
        it("returns empty filters", () => {
          const categoryFilter = new Map<string, string[]>();
          const classFilter = new Map<string, string[]>();
          classFilter.set("invalid.invalid", []);
          classFilter.set("invalidAttributes.invalid", []);
          const result = generateFilters(
            [
              createFirestoreFilter({
                code: "roofAttributes.minimumpitch",
                filterCode: "roofAttributes.minimumpitch",
                name: "minimumpitch",
                groupLabel: "minimumpitch",
                value: "8",
                unit: "°"
              }),
              createFirestoreFilter({
                code: "roofAttributes.minimumpitch",
                filterCode: "roofAttributes.minimumpitch",
                name: "minimumpitch",
                groupLabel: "minimumpitch",
                value: "9",
                unit: "°"
              }),
              createFirestoreFilter({
                code: "roofAttributes.minimumpitch",
                filterCode: "roofAttributes.minimumpitch",
                name: "minimumpitch",
                groupLabel: "minimumpitch",
                value: "10",
                unit: "°"
              })
            ],
            categoryFilter,
            classFilter
          );
          expect(result).toEqual([]);
        });
      });
    });
  });
});
