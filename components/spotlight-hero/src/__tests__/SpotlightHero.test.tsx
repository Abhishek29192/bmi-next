import React from "react";
import { render } from "@testing-library/react";
import Breadcrumbs from "@bmi/breadcrumbs";
import Typography from "@bmi/typography";
import SpotlightHero from "../";
import imageSource from "./images/demo-house.png";

const breadcrumbNode = (
  <Breadcrumbs isDarkThemed>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
      Products
    </Breadcrumbs.Item>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
      Roof
    </Breadcrumbs.Item>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
      Tiles
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
  </Breadcrumbs>
);

describe("SpotlightHero component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <SpotlightHero
        breadcrumbs={breadcrumbNode}
        title="H1 Heading desktop"
        imageSource={imageSource}
      >
        <Typography>
          Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu
          quis ex nostrud sunt ad eu laboris commodo deserunt commodo.
          Exercitation ullamco ipsum duis reprehenderit labore officia
          incididunt amet aliquip quis.
        </Typography>
      </SpotlightHero>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
