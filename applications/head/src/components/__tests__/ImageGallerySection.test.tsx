import { transformImagesSrc } from "../ImageGallerySection";

describe("ImageGallerySection component", () => {
  it("transforms correctly graphql response into expected Image props", () => {
    const givenData = [
      {
        title: "my test title",
        mainSource: { src: "url" },
        thumbnail: { src: "url" }
      },
      {
        title: "my test title2",
        mainSource: { src: "url2" },
        thumbnail: { src: "url2" }
      }
    ];
    const expectedData = [
      {
        mainSource: "url",
        thumbnail: "url",
        altText: "my test title"
      },
      {
        mainSource: "url2",
        thumbnail: "url2",
        altText: "my test title2"
      }
    ];

    expect(transformImagesSrc(givenData)).toEqual(expectedData);
  });
});
