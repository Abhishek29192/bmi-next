import { Data } from "../Promo";

describe("Promo component", () => {
  it("renders correctly", () => {
    const promo: Data = {
      __typename: "Promo",
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
});
