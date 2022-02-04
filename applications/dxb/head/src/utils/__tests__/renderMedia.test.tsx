import React from "react";
import { render } from "@testing-library/react";
import { renderMedia } from "../renderMedia";

const mockImageSrc = "test-image-src";
const mockAltText = "test-alt-test";

const MockContainer = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

describe("renderMedia", () => {
  it("should return img if arg mainImage === true", () => {
    const result = renderMedia(mockImageSrc, mockAltText);
    expect(result.type).toEqual("img");
  });
  it("should return img if arg mainImage is empty string", () => {
    const result = renderMedia("", mockAltText);
    expect(result).toEqual("");
  });
  it("should return img if arg mainImage === true and altText is undefined", () => {
    const { container } = render(
      <MockContainer>{renderMedia(mockImageSrc, undefined)}</MockContainer>
    );

    expect(container.getElementsByTagName("img")[0].alt).toBe("");
  });
});
