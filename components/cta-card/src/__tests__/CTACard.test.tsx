import React from "react";
import CTACard from "..";
import { render } from "@testing-library/react";
import demoHouseImage from "./images/demo-tiles.jpg";

describe("CtaCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <CTACard
        title="Call to Action Card"
        imageSource={demoHouseImage}
        action={{ model: "htmlLink", href: "#" }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});