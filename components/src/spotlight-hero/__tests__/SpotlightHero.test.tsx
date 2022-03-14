import React from "react";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs";
import Button from "../../button/Button";
import SpotlightHero from "../SpotlightHero";
import Typography from "../../typography/Typography";
import { renderWithThemeProvider } from "../../__tests__/helper";
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
    const { container } = renderWithThemeProvider(
      <SpotlightHero
        breadcrumbs={breadcrumbNode}
        title="H1 Heading desktop"
        media={<img src={imageSource} alt="Lorem ipsum" />}
      >
        <Typography>
          Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu
          quis ex nostrud sunt ad eu laboris commodo deserunt commodo.
          Exercitation ullamco ipsum duis reprehenderit labore officia
          incididunt amet aliquip quis.
        </Typography>
      </SpotlightHero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with cta", () => {
    const { container } = renderWithThemeProvider(
      <SpotlightHero
        breadcrumbs={breadcrumbNode}
        title="H1 Heading desktop"
        media={<img src={imageSource} alt="Lorem ipsum" />}
        cta={<Button label="CTA action">CTA action</Button>}
      >
        <Typography>
          Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu
          quis ex nostrud sunt ad eu laboris commodo deserunt commodo.
          Exercitation ullamco ipsum duis reprehenderit labore officia
          incididunt amet aliquip quis.
        </Typography>
      </SpotlightHero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with keyline", () => {
    const { container } = renderWithThemeProvider(
      <SpotlightHero
        breadcrumbs={breadcrumbNode}
        title="H1 Heading desktop"
        media={<img src={imageSource} alt="Lorem ipsum" />}
        isHeroKeyLine={true}
      >
        <Typography>
          Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu
          quis ex nostrud sunt ad eu laboris commodo deserunt commodo.
          Exercitation ullamco ipsum duis reprehenderit labore officia
          incididunt amet aliquip quis.
        </Typography>
      </SpotlightHero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders if media !== 'img'", () => {
    const { container } = renderWithThemeProvider(
      <SpotlightHero
        breadcrumbs={breadcrumbNode}
        title="H1 Heading desktop"
        media={
          <div>
            <img src={imageSource} alt="Lorem ipsum" />
          </div>
        }
        cta={<Button label="CTA action">CTA action</Button>}
      >
        <Typography>
          Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu
          quis ex nostrud sunt ad eu laboris commodo deserunt commodo.
          Exercitation ullamco ipsum duis reprehenderit labore officia
          incididunt amet aliquip quis.
        </Typography>
      </SpotlightHero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if title as React node", () => {
    const { container } = renderWithThemeProvider(
      <SpotlightHero title={<span className="test-title">Title</span>}>
        <Typography>
          Duis incididunt non laborum nulla consectetur irure ipsum. Laboris eu
          quis ex nostrud sunt ad eu laboris commodo deserunt commodo.
          Exercitation ullamco ipsum duis reprehenderit labore officia
          incididunt amet aliquip quis.
        </Typography>
      </SpotlightHero>
    );
    const titleComponent = container.querySelector(".test-title");
    expect(titleComponent).toBeDefined();
    expect(container).toMatchSnapshot();
  });
});
