import { describe, it } from "@jest/globals";
import { screen } from "@testing-library/react";
import React from "react";
import GenericImage from "../GenericImage";
import { renderWithProviders } from "../../../../__tests__/renderWithProviders";

describe("GenericImage", () => {
  it("should render with correct props", () => {
    renderWithProviders(
      <GenericImage
        altText="alt-text"
        src="https://localhost/image.jpg"
        width={100}
        height={200}
        className="custom-classname"
        size="contain"
        loading={"eager"}
        data-testid="custom-data-testid"
      />
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "alt-text");
    expect(image).toHaveAttribute(
      "src",
      "/_next/image?url=https%3A%2F%2Flocalhost%2Fimage.jpg&w=256&q=75"
    );
    expect(image).toHaveAttribute("width", "100");
    expect(image).toHaveAttribute("height", "200");
    expect(image).toHaveStyle({ objectFit: "contain" });
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("data-testid", "custom-data-testid");
    expect(image).toHaveAttribute("draggable", "false");
    expect(image).toHaveAttribute("decoding", "async");
    expect(image).toHaveClass("custom-classname");
  });

  it("should without objectFit style if size is undefined", () => {
    renderWithProviders(
      <GenericImage
        altText="alt-text"
        src="https://localhost/image.jpg"
        width={100}
        height={200}
        className="custom-classname"
        size={undefined}
        loading={"eager"}
        data-testid="custom-data-testid"
      />
    );

    const image = screen.getByRole("img");
    expect(image.style.objectFit).toEqual("");
  });
});
