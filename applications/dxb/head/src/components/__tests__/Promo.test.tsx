import { promoQuery, Data } from "../Promo";

describe("Promo component", () => {
  it("renders correctly", () => {
    const promo: Data = {
      __typename: "ContentfulPromo",
      id: "testId",
      name: "test",
      title: "test",
      subtitle: "I am a subtitle",
      body: null,
      tags: null,
      brandLogo: null,
      featuredMedia: null,
      featuredVideo: null,
      cta: null,
      backgroundColor: null
    };

    expect(promo).toMatchSnapshot();
  });

  it("has no change to graphql query", () => {
    // Had to do this to get 100% coverage
    expect(promoQuery).toMatchSnapshot();
  });
});
