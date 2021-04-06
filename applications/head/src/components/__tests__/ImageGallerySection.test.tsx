import React from "react";
import { render } from "@testing-library/react";
import ImageGallerySection, { Data } from "../ImageGallerySection";

describe("ImageGallerySection component", () => {
  it("renders correctly", () => {
    const data: Data = {
      __typename: "ContentfulImageGallerySection",
      title: "Lorem ipsum",
      description: null,
      medias: [
        {
          type: null,
          altText: "Lorem ipsum",
          caption: null,
          focalPoint: null,
          image: {
            fluid: {
              aspectRatio: 1,
              src: "",
              srcSet: "",
              sizes: ""
            },
            resize: {
              src: "link-to-page.png"
            },
            thumbnail: {
              src: "link-to-thumbnal.png"
            }
          }
        }
      ]
    };

    const { container } = render(<ImageGallerySection data={data} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
