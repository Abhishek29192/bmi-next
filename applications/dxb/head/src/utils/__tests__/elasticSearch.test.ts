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
        name: "appearanceAttributes.colourfamily",
        filterCode: "colourfamily",
        label: "Colour Family",
        options: [
          { label: "1", value: "colour1" },
          { label: "2", value: "colour2" }
        ]
      }
    ];
    const aggregations: Aggregations = {
      "appearanceAttributes.colourfamily": {
        buckets: [
          { key: "colour1", doc_count: 1 },
          { key: "bar", doc_count: 1 }
        ]
      }
    };

    const updatedFilters = removeIrrelevantFilters(filters, aggregations);
    const result = [
      {
        filterCode: "colourfamily",
        name: "appearanceAttributes.colourfamily",
        label: "Colour Family",
        options: [{ label: "1", value: "colour1" }]
      }
    ];

    expect(updatedFilters).toEqual(result);
  });

  it("should work with invalid aggregations", () => {
    const filters: Filter[] = [
      {
        name: "colour",
        filterCode: "colour",
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

  //TODO: DXB-3449 - remove when case agnostic to be reverted!
  it("should filter ignoring case of filter name", () => {
    const filters: Filter[] = [
      {
        name: "appearanceAttributes.colour",
        filterCode: "colour",
        label: "Colour",
        options: [{ label: "1", value: "colour1" }]
      }
    ];
    const aggregations: Aggregations = {
      "APPEARANCEATTRIBUTES.COLOUR": {
        buckets: [{ key: "colour1", doc_count: 1 }]
      }
    };

    const updatedFilters = removeIrrelevantFilters(filters, aggregations);
    const result = [
      {
        name: "appearanceAttributes.colour",
        filterCode: "colour",
        label: "Colour",
        options: [{ label: "1", value: "colour1" }]
      }
    ];

    expect(updatedFilters).toEqual(result);
  });
});

describe("disableFiltersFromAggregations function", () => {
  it("should disable based on aggregations", () => {
    const filters: Filter[] = [
      {
        name: "appearanceAttributes.colourfamily",
        filterCode: "colourfamily",
        label: "Colour Family",
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
        filterCode: "colourfamily",
        name: "appearanceAttributes.colourfamily",
        label: "Colour Family",
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
      filterCode: "foo",
      label: "Foo",
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" }
      ]
    },
    {
      name: "bar",
      filterCode: "bar",
      label: "Bar",
      value: ["BAR"],
      options: [{ label: "1", value: "1" }]
    },
    {
      name: "colour",
      filterCode: "colour",
      label: "Colour",
      value: ["Colour"],
      options: [{ label: "1", value: "colour1" }]
    }
  ];

  it("should ignore filters with no value", () => {
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      categoryCodes: ["foo"],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar"
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                    "keywords",
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
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar"
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                    "keywords",
                  ],
                  "query": "*bar*",
                  "type": "cross_fields",
                },
              },
              Object {
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      categoryCodes: ["foo"],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      categoryCodes: ["foo"],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar/"
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                    "keywords",
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
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      categoryCodes: ["foo"],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar@"
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                    "keywords",
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
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      categoryCodes: ["foo"],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar&"
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                    "keywords",
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
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      categoryCodes: ["foo"],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar°"
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                    "keywords",
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
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      categoryCodes: ["foo"],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar+"
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                    "keywords",
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
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      categoryCodes: ["foo"],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar²"
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                    "keywords",
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
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      categoryCodes: ["foo"],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar<"
    });

    expect(query).toMatchInlineSnapshot(`
      Object {
        "aggs": Object {
          "APPEARANCEATTRIBUTES.COLOURFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.COLOURFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "APPEARANCEATTRIBUTES.TEXTUREFAMILY": Object {
            "terms": Object {
              "field": "APPEARANCEATTRIBUTES.TEXTUREFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "BRAND": Object {
            "terms": Object {
              "field": "BRAND.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "CATEGORY": Object {
            "terms": Object {
              "field": "CATEGORY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "GENERALINFORMATION.MATERIALS": Object {
            "terms": Object {
              "field": "GENERALINFORMATION.MATERIALS.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTFAMILY": Object {
            "terms": Object {
              "field": "PRODUCTFAMILY.code.keyword",
              "include": undefined,
              "size": "300",
            },
          },
          "PRODUCTLINE": Object {
            "terms": Object {
              "field": "PRODUCTLINE.code.keyword",
              "include": undefined,
              "size": "300",
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
                    "keywords",
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
                "terms": Object {
                  "BAR.code.keyword": Array [
                    "BAR",
                  ],
                },
              },
              Object {
                "terms": Object {
                  "COLOUR.code.keyword": Array [
                    "Colour",
                  ],
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

  it("should group by base product code if group by variant is false", () => {
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      filters,
      groupByVariant: false,
      page: 0,
      pageSize: 10,
      searchQuery: "bar"
    });

    expect(query.collapse).toMatchInlineSnapshot(`
      Object {
        "field": "baseProduct.code.keyword",
        "inner_hits": Object {
          "name": "all_variants",
        },
      }
    `);
  });

  it("should group by variant product code if group by variant is true", () => {
    const query = compileElasticSearchQuery({
      allowFilterBy: [
        "ProductFamily",
        "ProductLine",
        "Brand",
        "appearanceAttributes.colourFamily",
        "generalInformation.materials",
        "appearanceAttributes.textureFamily",
        "Category"
      ],
      filters,
      groupByVariant: true,
      page: 0,
      pageSize: 10,
      searchQuery: "bar"
    });

    expect(query.collapse).toMatchInlineSnapshot(`
      Object {
        "field": "code.keyword",
        "inner_hits": Object {
          "name": "all_variants",
        },
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
          terms: { size: "100", field: "assetType.code.keyword" }
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
                query: "false",
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
          terms: { size: "100", field: "assetType.code.keyword" }
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
                query: "false",
                type: "cross_fields",
                fields: ["noIndex"]
              }
            },
            { term: { "assetType.code.keyword": "ASSEMBLY_INSTRUCTIONS" } }
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
