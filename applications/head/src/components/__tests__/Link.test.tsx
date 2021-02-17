import { getClickableActionFromUrl, getCTA } from "../Link";

describe("Icon component", () => {
  describe("getClickableActionFromUrl function", () => {
    it("returns a Link router to page path", () => {
      expect(
        getClickableActionFromUrl({ path: "some-page" }, undefined, "en")
      ).toMatchSnapshot();
    });
    it("returns a url", () => {
      expect(
        getClickableActionFromUrl(undefined, "some-page", "en")
      ).toMatchSnapshot();
    });
    it("returns undefined", () => {
      expect(
        getClickableActionFromUrl(undefined, undefined, "en")
      ).toBeUndefined();
    });
  });

  describe("getCTA function", () => {
    it("returns a cta object with a Promo cta", () => {
      expect(
        getCTA(
          {
            __typename: "ContentfulPromo",
            cta: {
              __typename: "ContentfulLink",
              id: "string",
              label: "string",
              icon: null,
              isLabelHidden: null,
              url: "https://www.external.co.uk",
              linkedPage: null
            }
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });
    it("returns a cta object with page", () => {
      expect(
        getCTA(
          {
            __typename: "ContentfulContactUsPage",
            path: "/contact-us"
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });
  });
});
