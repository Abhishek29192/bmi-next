import { query, Data } from "../PageInfo";

describe("Promo component", () => {
  it("has no change to props", () => {
    const data: Data = {
      __typename: "ContentfulSimplePage",
      id: "123456789",
      title: "Page title",
      subtitle: null,
      brandLogo: null,
      slug: "page-slug",
      path: "page-slug",
      date: null,
      tags: null,
      featuredMedia: null,
      featuredVideo: null
    };

    expect(data).toMatchSnapshot();
  });

  it("has no change to graphql query", () => {
    // Had to do this to get 100% coverage
    expect(query).toMatchSnapshot();
  });
});
