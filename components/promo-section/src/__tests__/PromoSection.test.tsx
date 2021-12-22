import React from "react";
import { render } from "@testing-library/react";
import mockImage from "path-to-image.png";
import PromoSection from "..";

describe("PromoSection component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <PromoSection
        title="H2 Heading"
        media={<img src={mockImage} alt="Lorem ipsum" />}
      >
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders a two-thirds row", () => {
    const { container } = render(
      <PromoSection
        title="H2 Heading"
        media={<img src={mockImage} alt="Lorem ipsum" />}
        layout="two-thirds"
      >
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders reversed", () => {
    const { container } = render(
      <PromoSection
        title="H2 Heading"
        media={<img src={mockImage} alt="Lorem ipsum" />}
        isReversed
      >
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders without a title", () => {
    const { container } = render(
      <PromoSection media={<img src={mockImage} alt="Lorem ipsum" />}>
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with white background", () => {
    const { container } = render(
      <PromoSection backgroundColor="white" className="test-class">
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with alabaster background", () => {
    const { container } = render(
      <PromoSection backgroundColor="alabaster" className="test-class">
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if no props passed", () => {
    const { container } = render(
      <PromoSection>
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container).toMatchSnapshot();
  });
});
