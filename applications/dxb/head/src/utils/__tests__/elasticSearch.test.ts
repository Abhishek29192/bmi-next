import { Filter } from "@bmi/filters";
import {
  removeIrrelevantFilters,
  disableFiltersFromAggregations,
  compileElasticSearchQuery,
  Aggregations
} from "../elasticSearch";

describe("removeIrrelevantFilters function", () => {
  it("should remove irrelevant filters", () => {
    const filters: Filter[] = [
      {
        name: "colour",
        label: "Colour",
        options: [
          { label: "1", value: "colour1" },
          { label: "2", value: "colour2" }
        ]
      }
    ];
    const aggregations: Aggregations = {
      colourfamily: {
        buckets: [
          { key: "colour1", doc_count: 1 },
          { key: "bar", doc_count: 1 }
        ]
      }
    };

    const updatedFilters = removeIrrelevantFilters(filters, aggregations);
    const result = [
      {
        name: "colour",
        label: "Colour",
        options: [{ label: "1", value: "colour1" }]
      }
    ];

    expect(updatedFilters).toEqual(result);
  });

  it("should work with invalid aggregations", () => {
    const filters: Filter[] = [
      {
        name: "colour",
        label: "Colour",
        options: [
          { label: "1", value: "colour1" },
          { label: "2", value: "colour2" }
        ]
      }
    ];
    const aggregations: Aggregations = {};

    const updatedFilters = removeIrrelevantFilters(filters, aggregations);
    const result = [];

    expect(updatedFilters).toEqual(result);
  });

  it("should filter with the default category filter name", () => {
    const filters: Filter[] = [
      {
        label: "Colour",
        options: [{ label: "1", value: "colour1" }]
      } as unknown as Filter
    ];
    const aggregations: Aggregations = {
      categories: {
        buckets: [{ key: "colour1", doc_count: 1 }]
      }
    };

    const updatedFilters = removeIrrelevantFilters(filters, aggregations);
    const result = [
      { label: "Colour", options: [{ label: "1", value: "colour1" }] }
    ];

    expect(updatedFilters).toEqual(result);
  });
});

describe("disableFiltersFromAggregations function", () => {
  it("should disable based on aggregations", () => {
    const filters: Filter[] = [
      {
        name: "colour",
        label: "Colour",
        options: [
          { label: "1", value: "colour1" },
          { label: "2", value: "colour2" }
        ]
      }
    ];
    const aggregations: Aggregations = {
      colourfamily: {
        buckets: [
          { key: "colour1", doc_count: 1 },
          { key: "bar", doc_count: 1 }
        ]
      }
    };

    const updatedFilters = disableFiltersFromAggregations(
      filters,
      aggregations
    );
    const result = [
      {
        name: "colour",
        label: "Colour",
        options: [
          { label: "1", value: "colour1", isDisabled: false },
          { label: "2", value: "colour2", isDisabled: true }
        ]
      }
    ];

    expect(updatedFilters).toEqual(result);
  });
});

describe("compileElasticSearchQuery function", () => {
  const filters: Filter[] = [
    {
      name: "foo",
      label: "Foo",
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" }
      ]
    },
    {
      name: "bar",
      label: "Bar",
      value: ["BAR"],
      options: [{ label: "1", value: "1" }]
    },
    {
      name: "colour",
      label: "Colour",
      value: ["Colour"],
      options: [{ label: "1", value: "colour1" }]
    }
  ];

  it("should ignore filters with no value", () => {
    const query = compileElasticSearchQuery(filters, ["foo"], 0, 10, "bar");

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "categories": Object {
            "terms": Object {
              "field": "categories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "colourfamilyCode.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "materialsCode.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "texturefamilyCode.keyword",
              "size": "100",
            },
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "colourfamilyValue.keyword",
                    "materialsValue.keyword",
                    "texturefamilyValue.keyword",
                    "measurementValue.keyword",
                    "categories.value.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6",
                  ],
                  "query": "*bar*",
                  "type": "cross_fields",
                },
              },
              Object {
                "terms": Object {
                  "allCategories.code.keyword": Array [
                    "foo",
                  ],
                },
              },
              Object {
                "term": Object {
                  "categories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "colourfamilyCode.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "scoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });

  it("should ignore filters with no searchQuery", () => {
    const query = compileElasticSearchQuery(filters, ["foo"], 0, 10);

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "categories": Object {
            "terms": Object {
              "field": "categories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "colourfamilyCode.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "materialsCode.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "texturefamilyCode.keyword",
              "size": "100",
            },
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "terms": Object {
                  "allCategories.code.keyword": Array [
                    "foo",
                  ],
                },
              },
              Object {
                "term": Object {
                  "categories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "colourfamilyCode.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "scoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });

  it("should ignore filters with no categoryCode", () => {
    const query = compileElasticSearchQuery(filters, [], 0, 10);

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "categories": Object {
            "terms": Object {
              "field": "categories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "colourfamilyCode.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "materialsCode.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "texturefamilyCode.keyword",
              "size": "100",
            },
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "terms": Object {
                  "allCategories.code.keyword": Array [],
                },
              },
              Object {
                "term": Object {
                  "categories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "colourfamilyCode.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "scoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });

  it("should transform slash in searchQuery", () => {
    const query = compileElasticSearchQuery(filters, ["foo"], 0, 10, "bar/");

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "categories": Object {
            "terms": Object {
              "field": "categories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "colourfamilyCode.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "materialsCode.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "texturefamilyCode.keyword",
              "size": "100",
            },
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "colourfamilyValue.keyword",
                    "materialsValue.keyword",
                    "texturefamilyValue.keyword",
                    "measurementValue.keyword",
                    "categories.value.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6",
                  ],
                  "query": "*bar//*",
                  "type": "cross_fields",
                },
              },
              Object {
                "terms": Object {
                  "allCategories.code.keyword": Array [
                    "foo",
                  ],
                },
              },
              Object {
                "term": Object {
                  "categories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "colourfamilyCode.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "scoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });
});
