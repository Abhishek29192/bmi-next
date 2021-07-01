import React from "react";
import { render } from "@testing-library/react";
import ImageGallery from "../";
import mockImage from "./images/demo-tiles.jpg";

describe("ImageGallery component", () => {
  it("renders correctly with default layout", () => {
    const images = [
      {
        media: <img src={mockImage} alt="Lorem ipsum" />,
        thumbnail: mockImage
      },
      {
        media: <img src={mockImage} alt="Lorem ipsum" />,
        thumbnail: mockImage
      },
      {
        media: <img src={mockImage} alt="Lorem ipsum" />,
        thumbnail: mockImage
      }
    ];

    const { container } = render(<ImageGallery images={images} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with deprecated imageSource", () => {
    const images = [
      {
        mainSource: mockImage,
        altText: "Demo Tiles",
        thumbnail: mockImage
      },
      {
        mainSource: mockImage,
        altText: "Demo Tiles Black"
      },
      {
        mainSource: mockImage,
        altText: "Demo house"
      }
    ];

    const { container } = render(<ImageGallery images={images} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders null when no images are passed", () => {
    const { container } = render(<ImageGallery images={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders without a thumbnail when one image is passed", () => {
    const { container } = render(
      <ImageGallery
        images={[
          {
            mainSource: mockImage,
            altText: "Single image"
          }
        ]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with short layout", () => {
    const images = [
      {
        mainSource: mockImage,
        altText: "Demo Tiles",
        thumbnail: mockImage
      },
      {
        mainSource: mockImage,
        altText: "Demo Tiles Black"
      },
      {
        mainSource: mockImage,
        altText: "Demo house"
      }
    ];

    const { container } = render(
      <ImageGallery images={images} layout="short" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});