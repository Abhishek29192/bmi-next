import { Data as PromoData } from "../Promo";

describe("Promo component", () => {
  it("renders correctly", () => {
    const promo: PromoData = {
      __typename: "ContentfulPromo",
      id: "testId",
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
});
