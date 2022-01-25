import React from "react";
import { render } from "@testing-library/react";
import CTACard from "..";
import demoHouseImage from "./images/demo-tiles.jpg";

describe("CtaCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <CTACard
        title="Call to Action Card"
        media={<img src={demoHouseImage} alt="Lorem ipsum" />}
        action={{ model: "htmlLink", href: "#" }}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with the clickable area around the heading", () => {
    const { container } = render(
      <CTACard
        title="Call to Action Card"
        clickableArea="heading"
        media={<img src={demoHouseImage} alt="Lorem ipsum" />}
        action={{ model: "htmlLink", href: "#" }}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with deprecated imageSource", () => {
    const { container } = render(
      <CTACard
        title="Call to Action Card"
        imageSource={demoHouseImage}
        action={{ model: "htmlLink", href: "#" }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
