import { Filter } from "@bmi/filters";
import {
  compileESQueryPLP,
  disableFiltersFromAggregationsPLP,
  Aggregations
} from "../elasticSearchPLP";

describe("disableFiltersFromAggregationsPLP function", () => {
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
      colour: {
        buckets: [
          { key: "colour1", doc_count: 1 },
          { key: "bar", doc_count: 1 }
        ]
      }
    };

    const updatedFilters = disableFiltersFromAggregationsPLP(
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

describe("compileESQueryPLP function", () => {
  describe("when filters parameter is null", () => {
    it("should generate valid query", () => {
      const query = compileESQueryPLP({
        filters: null,
        allowFilterBy: null,
        categoryCodes: ["Category"],
        page: 0,
        pageSize: 10
      });
      expect(query).toStrictEqual({
        size: 10,
        from: 0,
        sort: [
          "_score",
          { scoringWeightInt: "desc" },
          { "name.keyword": "asc" }
        ],
        aggs: {},
        query: {
          bool: {
            must: [{ terms: { "allCategories.code.keyword": ["Category"] } }]
          }
        }
      });
    });
  });

  describe("when filters parameter is empty array", () => {
    it("should generate valid query", () => {
      const query = compileESQueryPLP({
        filters: [],
        allowFilterBy: null,
        categoryCodes: ["Category"],
        page: 0,
        pageSize: 10
      });
      expect(query).toStrictEqual({
        size: 10,
        from: 0,
        sort: [
          "_score",
          { scoringWeightInt: "desc" },
          { "name.keyword": "asc" }
        ],
        aggs: {},
        query: {
          bool: {
            must: [{ terms: { "allCategories.code.keyword": ["Category"] } }]
          }
        }
      });
    });
  });

  describe("when filters parameter is Not empty array", () => {
    describe("and filters do not have a user selected values", () => {
      it("should generate valid query", () => {
        const query = compileESQueryPLP({
          filters: [
            {
              label: "filter-1",
              name: "filter-1",
              options: [{ label: "option-1", value: "option-1" }]
            }
          ],
          allowFilterBy: null,
          categoryCodes: ["Category"],
          page: 0,
          pageSize: 10
        });
        expect(query).toStrictEqual({
          size: 10,
          from: 0,
          sort: [
            "_score",
            { scoringWeightInt: "desc" },
            { "name.keyword": "asc" }
          ],
          aggs: {},
          query: {
            bool: {
              must: [{ terms: { "allCategories.code.keyword": ["Category"] } }]
            }
          }
        });
      });
    });
    describe("and filters have single user selected value", () => {
      it("should generate valid query with a term", () => {
        const query = compileESQueryPLP({
          filters: [
            {
              label: "filter-1",
              name: "filter-1",
              value: ["option-1"],
              options: [{ label: "option-1-label", value: "option-1" }]
            },
            {
              label: "filter-2",
              name: "filter-2",
              value: [],
              options: [{ label: "fl2-option-1-label", value: "fl2-option-1" }]
            }
          ],
          allowFilterBy: null,
          categoryCodes: ["Category"],
          page: 0,
          pageSize: 10
        });
        expect(query).toStrictEqual({
          size: 10,
          from: 0,
          sort: [
            "_score",
            { scoringWeightInt: "desc" },
            { "name.keyword": "asc" }
          ],
          aggs: {},
          query: {
            bool: {
              must: [
                { terms: { "allCategories.code.keyword": ["Category"] } },
                { term: { "filter-1.code.keyword": "option-1" } }
              ]
            }
          }
        });
      });
    });
    describe("and filters have multiple user selected value", () => {
      it("should generate valid query with multiple term clauses", () => {
        const query = compileESQueryPLP({
          filters: [
            {
              label: "filter-1",
              name: "filter-1",
              value: ["option-1"],
              options: [{ label: "option-1-label", value: "option-1" }]
            },
            {
              label: "filter-2",
              name: "filter-2",
              value: ["fl2-option-1"],
              options: [{ label: "fl2-option-1-label", value: "fl2-option-1" }]
            }
          ],
          allowFilterBy: null,
          categoryCodes: ["Category"],
          page: 0,
          pageSize: 10
        });
        expect(query).toStrictEqual({
          size: 10,
          from: 0,
          sort: [
            "_score",
            { scoringWeightInt: "desc" },
            { "name.keyword": "asc" }
          ],
          aggs: {},
          query: {
            bool: {
              must: [
                { terms: { "allCategories.code.keyword": ["Category"] } },
                { term: { "filter-1.code.keyword": "option-1" } },
                { term: { "filter-2.code.keyword": "fl2-option-1" } }
              ]
            }
          }
        });
      });
    });
  });

  describe("when allowFilterBy parameter is null", () => {
    it("should generate valid query", () => {
      const query = compileESQueryPLP({
        filters: [],
        allowFilterBy: null,
        categoryCodes: ["Category"],
        page: 0,
        pageSize: 10
      });
      expect(query).toStrictEqual({
        size: 10,
        from: 0,
        sort: [
          "_score",
          { scoringWeightInt: "desc" },
          { "name.keyword": "asc" }
        ],
        aggs: {},
        query: {
          bool: {
            must: [{ terms: { "allCategories.code.keyword": ["Category"] } }]
          }
        }
      });
    });
  });

  describe("when allowFilterBy parameter is empty array", () => {
    it("should generate valid query", () => {
      const query = compileESQueryPLP({
        filters: [],
        allowFilterBy: [],
        categoryCodes: ["Category"],
        page: 0,
        pageSize: 10
      });
      expect(query).toStrictEqual({
        size: 10,
        from: 0,
        sort: [
          "_score",
          { scoringWeightInt: "desc" },
          { "name.keyword": "asc" }
        ],
        aggs: {},
        query: {
          bool: {
            must: [{ terms: { "allCategories.code.keyword": ["Category"] } }]
          }
        }
      });
    });
  });

  describe("when allowFilterBy parameter is has filter by Categories", () => {
    it("should generate valid query with No includes", () => {
      const query = compileESQueryPLP({
        filters: [],
        allowFilterBy: ["Category", "Brand"],
        categoryCodes: ["Category"],
        page: 0,
        pageSize: 10
      });
      expect(query).toStrictEqual({
        size: 10,
        from: 0,
        sort: [
          "_score",
          { scoringWeightInt: "desc" },
          { "name.keyword": "asc" }
        ],
        aggs: {
          Category: {
            terms: {
              size: "100",
              field: "Category.code.keyword",
              include: undefined
            }
          },
          Brand: {
            terms: {
              size: "100",
              field: "Brand.code.keyword",
              include: undefined
            }
          }
        },
        query: {
          bool: {
            must: [{ terms: { "allCategories.code.keyword": ["Category"] } }]
          }
        }
      });
    });
    it("should generate valid query with category options to include", () => {
      const query = compileESQueryPLP({
        filters: [],
        allowFilterBy: ["Category", "Brand", "Category | PRODUCTS_NO"],
        categoryCodes: ["Category"],
        page: 0,
        pageSize: 10
      });
      expect(query).toStrictEqual({
        size: 10,
        from: 0,
        sort: [
          "_score",
          { scoringWeightInt: "desc" },
          { "name.keyword": "asc" }
        ],
        aggs: {
          Category: {
            terms: {
              size: "100",
              field: "Category.code.keyword",
              include: ["PRODUCTS_NO"]
            }
          },
          Brand: {
            terms: {
              size: "100",
              field: "Brand.code.keyword",
              include: undefined
            }
          }
        },
        query: {
          bool: {
            must: [{ terms: { "allCategories.code.keyword": ["Category"] } }]
          }
        }
      });
    });
  });
  describe("when allowFilterBy parameter is has filter by attributes", () => {
    describe("and single attribute is passed", () => {
      it("should generate valid query with No includes", () => {
        const query = compileESQueryPLP({
          filters: [],
          allowFilterBy: ["roofAttributes.minimumpitch"],
          categoryCodes: ["Category"],
          page: 0,
          pageSize: 10
        });
        expect(query).toStrictEqual({
          size: 10,
          from: 0,
          sort: [
            "_score",
            { scoringWeightInt: "desc" },
            { "name.keyword": "asc" }
          ],
          aggs: {
            "roofAttributes.minimumpitch": {
              terms: {
                size: "100",
                field: "roofAttributes.minimumpitch.code.keyword",
                include: undefined
              }
            }
          },
          query: {
            bool: {
              must: [{ terms: { "allCategories.code.keyword": ["Category"] } }]
            }
          }
        });
      });
    });

    describe("and multiple attribute is passed", () => {
      it("should generate valid query with No includes", () => {
        const query = compileESQueryPLP({
          filters: [],
          allowFilterBy: [
            "roofAttributes.minimumpitch",
            "measurements.length",
            "generalInformation.materials"
          ],
          categoryCodes: ["Category"],
          page: 0,
          pageSize: 10
        });
        expect(query).toStrictEqual({
          size: 10,
          from: 0,
          sort: [
            "_score",
            { scoringWeightInt: "desc" },
            { "name.keyword": "asc" }
          ],
          aggs: {
            "roofAttributes.minimumpitch": {
              terms: {
                size: "100",
                field: "roofAttributes.minimumpitch.code.keyword",
                include: undefined
              }
            },
            "measurements.length": {
              terms: {
                size: "100",
                field: "measurements.length.code.keyword",
                include: undefined
              }
            },
            "generalInformation.materials": {
              terms: {
                size: "100",
                field: "generalInformation.materials.code.keyword",
                include: undefined
              }
            }
          },
          query: {
            bool: {
              must: [{ terms: { "allCategories.code.keyword": ["Category"] } }]
            }
          }
        });
      });
    });
  });
});
