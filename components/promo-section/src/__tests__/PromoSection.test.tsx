import React from "react";
import PromoSection from "..";
import { render } from "@testing-library/react";
import mockImage from "path-to-image.png";

describe("PromoSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <PromoSection title="H2 Heading" imageSource={mockImage}>
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a two-thirds row", () => {
    const { container } = render(
      <PromoSection
        title="H2 Heading"
        imageSource={mockImage}
        layout="two-thirds"
      >
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders reversed", () => {
    const { container } = render(
      <PromoSection title="H2 Heading" imageSource={mockImage} isReversed>
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders without a title", () => {
    const { container } = render(
      <PromoSection imageSource={mockImage}>
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
