import { getClickableActionFromUrl } from "../Link";

describe("Icon component", () => {
  describe("getClickableActionFromUrl function", () => {
    it("returns a Link router to page slug", () => {
      expect(
        getClickableActionFromUrl({ slug: "some-page" }, undefined, "en")
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
});
