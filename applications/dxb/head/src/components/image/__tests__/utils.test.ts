import { describe, expect, it } from "@jest/globals";
import { isContentfulImage } from "../utils";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";

describe("isContentfulImage", () => {
  it("should return true if __typename is 'ContentfulImage'", () => {
    expect(
      isContentfulImage({
        ...createImageData({ __typename: "ContentfulImage" }),
        widths: [1, 2, 3, 4, 5]
      })
    ).toEqual(true);
  });

  it("should return false if __typename is undefined", () => {
    expect(
      isContentfulImage({
        altText: "alt-text",
        src: "https://localhost/image.jpg",
        width: 100,
        height: 200
      })
    ).toEqual(false);
  });
});
