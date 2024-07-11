import resolveImage from "../ContentfulImage";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";

describe("ContentfulImage resolver", () => {
  it("should return data without focalPoint if not provided", () => {
    expect(resolveImage(createImageData({ focalPoint: null }))).toEqual({
      __typename: "Image",
      altText: "Alt text",
      title: "Test image",
      image: {
        fileName: "custom-image.jpg",
        contentType: "image/jpeg",
        url: "http://localhost:8080/custom-image.jpg",
        size: 1000,
        height: 200,
        width: 400
      },
      focalPoint: null,
      type: "Decorative"
    });
  });

  it("returns correct data when focalPoint field provided", () => {
    expect(
      resolveImage(createImageData({ focalPoint: { x: 25, y: 20 } }))
    ).toEqual({
      __typename: "Image",
      altText: "Alt text",
      title: "Test image",
      image: {
        fileName: "custom-image.jpg",
        contentType: "image/jpeg",
        url: "http://localhost:8080/custom-image.jpg",
        size: 1000,
        height: 200,
        width: 400
      },
      focalPoint: { x: 6, y: 10 },
      type: "Decorative"
    });
  });
});
