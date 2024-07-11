import { Data } from "../PageInfo";

describe("Promo component", () => {
  it("has no change to props", () => {
    const data: Data = {
      __typename: "Page",
      id: "123456789",
      title: "Page title",
      subtitle: null,
      brandLogo: null,
      slug: "page-slug",
      path: "page-slug",
      date: null,
      rawDate: null,
      tags: null,
      featuredMedia: null,
      featuredVideo: null
    };

    expect(data).toMatchSnapshot();
  });
});
