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
    expect(container).toMatchSnapshot();
  });
  it("renders null when no images are passed", () => {
    const { container } = render(<ImageGallery images={[]} />);
    expect(container).toMatchSnapshot();
  });
  it("renders without a thumbnail when one image is passed", () => {
    const { container } = render(
      <ImageGallery
        images={[
          {
            media: <img src={mockImage} alt="Lorem ipsum" />,
            altText: "Single image"
          }
        ]}
      />
    );
    expect(container).toMatchSnapshot();
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
    expect(container).toMatchSnapshot();
  });
  it("renders empty image gallery when no media and main source are supplied", () => {
    const { container } = render(<ImageGallery images={[{}]} />);
    expect(container).toMatchSnapshot();
  });
  it("renders caption of first image when caption is present", () => {
    const images = [
      {
        altText: "Demo Tiles",
        thumbnail: mockImage,
        caption:
          "test caption : renders this caption from first image as this is default active index!!"
      },
      {
        thumbnail: mockImage,
        altText: "Demo Tiles Black"
      },
      {
        thumbnail: mockImage,
        altText: "Demo house"
      }
    ];

    const { container } = render(
      <ImageGallery images={images} layout="short" />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with main-image-wrapper--cover style if imageSize is not contain", () => {
    const images = [
      {
        media: <img src={mockImage} alt="Lorem ipsum" />,
        thumbnail: mockImage
      }
    ];

    const { container } = render(
      <ImageGallery images={images} imageSize="cover" />
    );

    expect(container.querySelector(".main-image-wrapper--cover")).toBeTruthy();
  });
  it("renders MobileThumbnails if isTouchDevice is true", () => {
    Object.defineProperty(document.documentElement, "ontouchstart", jest.fn());
    const images = [
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
    expect(container.querySelector(".thumbnails--touch")).toBeTruthy();
  });
});
