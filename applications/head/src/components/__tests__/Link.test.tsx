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
            cta: {
              __typename: "ContentfulLink",
              id: "string",
              label: "string",
              icon: null,
              isLabelHidden: null,
              url: "https://www.external.co.uk",
              linkedPage: null,
              type: "External",
              parameters: null
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
            path: "/contact-us"
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });

    it("returns a null object with page without path", () => {
      expect(
        getCTA(
          {
            path: null
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });

    it("returns a null object with page with empty path", () => {
      expect(
        getCTA(
          {
            path: ""
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });

    it("returns a cta object with a simple page cta", () => {
      expect(
        getCTA(
          {
            cta: {
              __typename: "ContentfulLink",
              id: "string",
              label: "string",
              icon: null,
              isLabelHidden: null,
              url: "https://www.external.co.uk",
              linkedPage: null,
              type: "External",
              parameters: null
            }
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });

    it("returns a null object when a simple page without cta", () => {
      expect(
        getCTA(
          {
            cta: null
          },
          "no",
          "Go to Page"
        )
      ).toMatchSnapshot();
    });
  });
});
