import React from "react";
import mockImage from "path-to-image.png";
import PromoSection from "../PromoSection";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("PromoSection component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
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
    const { container } = renderWithThemeProvider(
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
    const { container } = renderWithThemeProvider(
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
    const { container } = renderWithThemeProvider(
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
    const { container } = renderWithThemeProvider(
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
    const { container } = renderWithThemeProvider(
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
    const { container } = renderWithThemeProvider(
      <PromoSection>
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if title is react node", () => {
    const { container } = renderWithThemeProvider(
      <PromoSection title={<span className="test-title">Title</span>}>
        Vestibulum quis ultricies diam. Quisque porttitor sit amet elit sit amet
        mollis. Aliquam eget interdum enim. Aliquam mattis hendrerit quam,
        tincidunt posuere purus rutrum sit amet. In tincidunt, enim ac suscipit
        feugiat, lacus lorem venenatis libero, id efficitur ipsum nisi ut nibh.
      </PromoSection>
    );
    const titleComponent = container.querySelector(".test-title");
    expect(titleComponent).toBeDefined();
    expect(container).toMatchSnapshot();
  });
});
