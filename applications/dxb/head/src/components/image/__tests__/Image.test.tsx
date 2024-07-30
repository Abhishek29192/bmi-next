import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";
import Image from "../Image";

const ContentfulImageComponent = () => {
  return <div>ContentfulImage</div>;
};
jest.mock("../contentful-image/ContentfulImage", () => ({
  __esModule: true,
  default: () => ContentfulImageComponent()
}));

const GenericImageComponent = () => {
  return <div>GenericImage</div>;
};
jest.mock("../generic-image/GenericImage", () => ({
  __esModule: true,
  default: () => GenericImageComponent()
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("Image", () => {
  it("should render the ContentfulImage component if the props are from Contentful", () => {
    renderWithProviders(
      <Image
        {...createImageData({ __typename: "Image" })}
        widths={[1, 2, 3, 4, 5]}
      />
    );

    expect(screen.getByText("ContentfulImage")).toBeTruthy();
    expect(screen.queryByText("GenericImage")).toBeNull();
  });

  it("should render the GenericImage component if the props are not from Contentful", () => {
    renderWithProviders(
      <Image
        altText="alt-text"
        src="http://localhost/generic-image.jpg"
        width={100}
        height={200}
        widths={[1, 2, 3, 4, 5]}
      />
    );

    expect(screen.queryByText("ContentfulImage")).toBeNull();
    expect(screen.getByText("GenericImage")).toBeTruthy();
  });
});
