import React from "react";
import { render } from "@testing-library/react";
import ToggleCard from "../";
import demoFormattedImage from "./images/demo-product-format.jpg";

describe("ToggleCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
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
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders a disabled card", () => {
    const { container } = render(
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
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders a card containing title only", () => {
    const { container } = render(
      <ToggleCard id="A Unique ID" title="Title only" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
