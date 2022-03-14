import React from "react";
import ToggleCard from "../ToggleCard";
import { renderWithThemeProvider } from "../../__tests__/helper";
import demoFormattedImage from "./images/demo-product-format.jpg";
import svgImage from "./images/demo-roof-shape.svg";

describe("ToggleCard component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <ToggleCard
        id="A Unique ID"
        title="Curabitur posuere varius erat"
        imageSource={demoFormattedImage}
      >
        <ToggleCard.Paragraph>
          Asfalt underlagsbelegg med selvklebende omlegg. Kategori: Bra
        </ToggleCard.Paragraph>
        <ToggleCard.Paragraph>
          Nobb: <strong>123456789</strong>
        </ToggleCard.Paragraph>
      </ToggleCard>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with no title", () => {
    const { container } = renderWithThemeProvider(
      <ToggleCard id="A Unique ID" imageSource={demoFormattedImage}>
        <ToggleCard.Paragraph>
          Asfalt underlagsbelegg med selvklebende omlegg. Kategori: Bra
        </ToggleCard.Paragraph>
        <ToggleCard.Paragraph>
          Nobb: <strong>123456789</strong>
        </ToggleCard.Paragraph>
      </ToggleCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders a disabled card", () => {
    const { container } = renderWithThemeProvider(
      <ToggleCard
        id="Another Unique ID"
        disabled
        title="Curabitur posuere varius erat"
        imageSource={demoFormattedImage}
      >
        <ToggleCard.Paragraph>
          Asfalt underlagsbelegg med selvklebende omlegg. Kategori: Bra
        </ToggleCard.Paragraph>
        <ToggleCard.Paragraph>
          Nobb: <strong>123456789</strong>
        </ToggleCard.Paragraph>
      </ToggleCard>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders a card containing title only", () => {
    const { container } = renderWithThemeProvider(
      <ToggleCard id="A Unique ID" title="Title only" />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders card with illustrated image", () => {
    const { container } = renderWithThemeProvider(
      <ToggleCard
        id="A Unique ID"
        title="Title only"
        illustratedImage={svgImage}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
