import React from "react";
import Hero from "../";
import { render } from "@testing-library/react";
import Typography from "@bmi/typography";
import imageSource from "../components/hero/images/demo-tiles.jpg";

describe("Hero component", () => {
  it("renders with children", () => {
    const { container } = render(
      <Hero
        breadcrumbs={<div />}
        imageSource={imageSource}
        title="Concrete Tiles"
      >
        <Typography>
          Excepturi sint occaecati cupiditate non provident, similique sunt in
          culpa qui officia deserunt mollitia animi, id est laborum et dolorum
          fuga. Et harum
        </Typography>
      </Hero>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders level 2 with no image", () => {
    const { container } = render(
      <Hero breadcrumbs={<div />} title="Concrete Tiles" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders level 3 with no image & light themed", () => {
    const { container } = render(
      <Hero breadcrumbs={<div />} title="Concrete Tiles" isLightThemed />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
