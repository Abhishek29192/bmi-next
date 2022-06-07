import { Filter } from "@bmi/components";
import {
  Aggregations,
  compileElasticSearchQuery,
  disableFiltersFromAggregations,
  getCountQuery,
  getDocumentQueryObject,
  removeIrrelevantFilters
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
      allCategories: {
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
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "escape": true,
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "APPEARANCEATTRIBUTES.COLOURFAMILY.name.keyword",
                    "GENERALINFORMATION.MATERIALS.name.keyword",
                    "APPEARANCEATTRIBUTES.TEXTUREFAMILY.name.keyword",
                    "measurementValue.keyword",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
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
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
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
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
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
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "escape": true,
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "APPEARANCEATTRIBUTES.COLOURFAMILY.name.keyword",
                    "GENERALINFORMATION.MATERIALS.name.keyword",
                    "APPEARANCEATTRIBUTES.TEXTUREFAMILY.name.keyword",
                    "measurementValue.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6",
                  ],
                  "query": "*bar *",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });

  it("should transform @ in searchQuery", () => {
    const query = compileElasticSearchQuery(filters, ["foo"], 0, 10, "bar@");

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "escape": true,
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "APPEARANCEATTRIBUTES.COLOURFAMILY.name.keyword",
                    "GENERALINFORMATION.MATERIALS.name.keyword",
                    "APPEARANCEATTRIBUTES.TEXTUREFAMILY.name.keyword",
                    "measurementValue.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6",
                  ],
                  "query": "*bar *",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });

  it("should transform ampersand in searchQuery", () => {
    const query = compileElasticSearchQuery(filters, ["foo"], 0, 10, "bar&");

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "escape": true,
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "APPEARANCEATTRIBUTES.COLOURFAMILY.name.keyword",
                    "GENERALINFORMATION.MATERIALS.name.keyword",
                    "APPEARANCEATTRIBUTES.TEXTUREFAMILY.name.keyword",
                    "measurementValue.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6",
                  ],
                  "query": "*bar *",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });

  it("should transform degree symbol in searchQuery", () => {
    const query = compileElasticSearchQuery(filters, ["foo"], 0, 10, "bar°");

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "escape": true,
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "APPEARANCEATTRIBUTES.COLOURFAMILY.name.keyword",
                    "GENERALINFORMATION.MATERIALS.name.keyword",
                    "APPEARANCEATTRIBUTES.TEXTUREFAMILY.name.keyword",
                    "measurementValue.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6",
                  ],
                  "query": "*bar *",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });

  it("should transform plus in searchQuery", () => {
    const query = compileElasticSearchQuery(filters, ["foo"], 0, 10, "bar+");

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "escape": true,
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "APPEARANCEATTRIBUTES.COLOURFAMILY.name.keyword",
                    "GENERALINFORMATION.MATERIALS.name.keyword",
                    "APPEARANCEATTRIBUTES.TEXTUREFAMILY.name.keyword",
                    "measurementValue.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6",
                  ],
                  "query": "*bar *",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });

  it("should transform superscript characters in searchQuery", () => {
    const query = compileElasticSearchQuery(filters, ["foo"], 0, 10, "bar²");

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "escape": true,
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "APPEARANCEATTRIBUTES.COLOURFAMILY.name.keyword",
                    "GENERALINFORMATION.MATERIALS.name.keyword",
                    "APPEARANCEATTRIBUTES.TEXTUREFAMILY.name.keyword",
                    "measurementValue.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6",
                  ],
                  "query": "*bar *",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });

  it("should transform smaller characters in searchQuery", () => {
    const query = compileElasticSearchQuery(filters, ["foo"], 0, 10, "bar<");

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "allCategories": Object {
            "terms": Object {
              "field": "allCategories.code.keyword",
              "size": "100",
            },
          },
          "colourfamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "size": "100",
            },
          },
          "materials": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "size": "100",
            },
          },
          "texturefamily": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "size": "100",
            },
          },
          "unique_base_products_count": Object {
            "cardinality": Object {
              "field": "code.keyword",
            },
          },
        },
        "collapse": Object {
          "field": "code.keyword",
          "inner_hits": Object {
            "name": "all_variants",
          },
        },
        "from": 0,
        "query": Object {
          "bool": Object {
            "must": Array [
              Object {
                "query_string": Object {
                  "escape": true,
                  "fields": Array [
                    "externalProductCode",
                    "name^5",
                    "summary",
                    "description",
                    "longDescription",
                    "shortDescription",
                    "APPEARANCEATTRIBUTES.COLOURFAMILY.name.keyword",
                    "GENERALINFORMATION.MATERIALS.name.keyword",
                    "APPEARANCEATTRIBUTES.TEXTUREFAMILY.name.keyword",
                    "measurementValue.keyword",
                    "allCategories.value.keyword",
                    "classifications.features.featureValues.value^6",
                  ],
                  "query": "*bar *",
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
                  "allCategories.code.keyword": "BAR",
                },
              },
              Object {
                "term": Object {
                  "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword": "Colour",
                },
              },
            ],
          },
        },
        "size": 10,
        "sort": Array [
          "_score",
          Object {
            "productScoringWeightInt": "desc",
          },
          Object {
            "variantScoringWeightInt": "desc",
          },
          Object {
            "name.keyword": "asc",
          },
        ],
      }
    `);
  });
});

describe("getCountQuery function", () => {
  it("should return correct object if aggs is not undefined", () => {
    const queryObject = {
      size: 24,
      from: 1 * 24,
      sort: [{ "assetType.name.keyword": "asc", "title.keyword": "asc" }],
      aggs: {
        assetTypes: {
          terms: {
            size: "100",
            field: "assetType.pimCode.keyword"
          }
        },
        total: {
          cardinality: {
            field: "titleAndSize.keyword"
          }
        }
      },
      query: {
        query_string: {
          query: `*icopal*`,
          type: "cross_fields",
          fields: ["title"]
        }
      },
      collapse: {
        field: "titleAndSize.keyword"
      }
    };

    const expectedResult = {
      size: 0,
      query: {
        query_string: {
          query: `*icopal*`,
          type: "cross_fields",
          fields: ["title"]
        }
      },
      aggs: {
        assetTypes: {
          terms: {
            size: "100",
            field: "assetType.pimCode.keyword"
          }
        },
        total: {
          cardinality: {
            field: "titleAndSize.keyword"
          }
        }
      }
    };

    const actualResult = getCountQuery(queryObject);

    expect(actualResult).toMatchObject(expectedResult);
  });

  it("should return correct object if aggs is undefined", () => {
    const queryObject = {
      size: 24,
      from: 1 * 24,
      sort: [{ "assetType.name.keyword": "asc", "title.keyword": "asc" }],
      query: {
        query_string: {
          query: `*icopal*`,
          type: "cross_fields",
          fields: ["title"]
        }
      },
      collapse: {
        field: "titleAndSize.keyword"
      }
    };

    const expectedResult = {
      size: 0,
      query: {
        query_string: {
          query: `*icopal*`,
          type: "cross_fields",
          fields: ["title"]
        }
      }
    };

    const actualResult = getCountQuery(queryObject);

    expect(actualResult).toMatchObject(expectedResult);
  });
});

describe("getDocumentQueryObject function", () => {
  it("should return correct document query object", () => {
    const expectedResult = {
      size: 24,
      from: 0,
      sort: [{ "assetType.name.keyword": "asc", "title.keyword": "asc" }],
      aggs: {
        assetTypes: {
          terms: { size: "100", field: "assetType.pimCode.keyword" }
        },
        total: { cardinality: { field: "titleAndSize.keyword" } }
      },
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: "*icopal*",
                type: "cross_fields",
                fields: ["title"]
              }
            },
            {
              query_string: {
                query: "true",
                type: "cross_fields",
                fields: ["noIndex"]
              }
            }
          ]
        }
      },
      collapse: { field: "titleAndSize.keyword" }
    };

    const actualResult = getDocumentQueryObject("icopal", 24);
    expect(actualResult).toMatchObject(expectedResult);
  });

  it("should return correct document query object with filters", () => {
    const expectedResult = {
      size: 24,
      from: 0,
      sort: [{ "assetType.name.keyword": "asc", "title.keyword": "asc" }],
      aggs: {
        assetTypes: {
          terms: { size: "100", field: "assetType.pimCode.keyword" }
        },
        total: { cardinality: { field: "titleAndSize.keyword" } }
      },
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: "*icopal*",
                type: "cross_fields",
                fields: ["title"]
              }
            },
            {
              query_string: {
                query: "true",
                type: "cross_fields",
                fields: ["noIndex"]
              }
            },
            { term: { "assetType.pimCode.keyword": "ASSEMBLY_INSTRUCTIONS" } }
          ]
        }
      },
      collapse: { field: "titleAndSize.keyword" }
    };

    const actualResult = getDocumentQueryObject("icopal", 24, 0, [
      { value: ["ASSEMBLY_INSTRUCTIONS"] }
    ]);
    expect(actualResult).toMatchObject(expectedResult);
  });
});
