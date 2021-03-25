import React from "react";
import { render } from "@testing-library/react";
import CTACard from "..";
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
  describe("CtaCard with component as imageSource", () => {
    it("renders correctly", () => {
      const { container } = render(
        <CTACard
          title="Call to Action Card"
          imageSource={<div>I am component</div>}
          action={{ model: "htmlLink", href: "#" }}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
