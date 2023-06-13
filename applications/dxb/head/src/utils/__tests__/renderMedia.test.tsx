import { render, screen } from "@testing-library/react";
import React from "react";
import { renderMedia } from "../renderMedia";

const mockImageSrc = "test-image-src";
const mockAltText = "test-alt-test";

const MockContainer = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

describe("renderMedia", () => {
  it("should return img if arg mainImage === true", () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const image = renderMedia(mockImageSrc, mockAltText)!;
    expect(image.type).toEqual("img");
  });
  it("should return img if arg mainImage is empty string", () => {
    const view = renderMedia("", mockAltText);
    expect(view).toBeUndefined();
  });
  it("should return img if arg mainImage === true and altText is undefined", () => {
    render(
      <MockContainer>{renderMedia(mockImageSrc, undefined)}</MockContainer>
    );

    expect((screen.getByRole("img") as HTMLImageElement).alt).toBe("");
  });
});
