import React from "react";
import ImageGallery from "../";
import { render } from "@testing-library/react";
import mockImage from "./images/demo-tiles.jpg";

const images = [
  {
    mainSource: mockImage,
    altText: "Demo Tiles"
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

describe("ImageGallery component", () => {
  it("renders correctly", () => {
    const { container } = render(<ImageGallery images={images} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
