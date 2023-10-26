import {
  constructFiltersQuery,
  constructSearchQuery
} from "../constructEsQuery";

describe("constructFiltersQuery", () => {
  it("returns an empty array if there are no selected filters", () => {
    const res = constructFiltersQuery([
      {
        filterCode: "catalogueId",
        label: "Catalogues",
        name: "catalogue",
        value: [],
        options: [
          {
            value: "1",
            label: "Catalogue 1"
          },
          {
            value: "2",
            label: "Catalogue 2"
          }
        ]
      },
      {
        filterCode: "category",
        label: "Categories",
        name: "category",
        value: [],
        options: [
          {
            value: "Flat",
            label: "flat"
          },
          {
            value: "Pitched",
            label: "pitched"
          }
        ]
      }
    ]);

    expect(res).toEqual([]);
  });

  it("returns correct filters if there are selected filters", () => {
    const res = constructFiltersQuery([
      {
        filterCode: "catalogueId",
        label: "Catalogues",
        name: "catalogue",
        value: ["1"],
        options: [
          {
            value: "1",
            label: "Catalogue 1"
          },
          {
            value: "2",
            label: "Catalogue 2"
          }
        ]
      },
      {
        filterCode: "category",
        label: "Categories",
        name: "category",
        value: ["flat", "pitched"],
        options: [
          {
            value: "flat",
            label: "Flat"
          },
          {
            value: "pitched",
            label: "Pitched"
          }
        ]
      }
    ]);

    expect(res).toEqual([
      { terms: { "catalogueId.keyword": ["1"] } },
      { terms: { "category.keyword": ["flat", "pitched"] } }
    ]);
  });
});

describe("constructSearchQuery", () => {
  it("returns correct query if searchQuery === null", () => {
    const query = constructSearchQuery(null);
    expect(query).toEqual({
      query_string: {
        query: "*",
        fields: ["code", "name"]
      }
    });
  });

  it("returns correct query if provided searchQuery", () => {
    const query = constructSearchQuery("fake query");
    expect(query).toEqual({
      query_string: {
        query: "*fake query*",
        fields: ["code", "name"]
      }
    });
  });
});
