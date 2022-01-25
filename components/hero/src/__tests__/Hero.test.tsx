import React from "react";
import Button from "@bmi/button";
import { render } from "@testing-library/react";
import imageSource from "mock-image.jpg";
import Hero from "../";

describe("Hero component", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it("renders level 1", () => {
    const { container } = render(
      <Hero
        media={<img src={imageSource} alt="Lorem ipsum" />}
        title="H1 Heading"
        level={1}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non
        tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus
        suscipit dolor nisl, nec vestibulum odio molestie tincidunt.
      </Hero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders level 1 with CTA", () => {
    const { container } = render(
      <Hero
        media={<img src={imageSource} alt="Lorem ipsum" />}
        title="H1 Heading"
        level={1}
        cta={<Button label="CTA action">CTA action</Button>}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non
        tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus
        suscipit dolor nisl, nec vestibulum odio molestie tincidunt.
      </Hero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with deprecated imageSource", () => {
    const { container } = render(
      <Hero imageSource={imageSource} title="H1 Heading" level={1}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non
        tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus
        suscipit dolor nisl, nec vestibulum odio molestie tincidunt.
      </Hero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with deprecated imageSource - not string", () => {
    const imageSourceElement = <img src={imageSource} />;
    const { container } = render(
      <Hero imageSource={imageSourceElement} title="H1 Heading" level={1}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non
        tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus
        suscipit dolor nisl, nec vestibulum odio molestie tincidunt.
      </Hero>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders level 2", () => {
    const { container } = render(<Hero title="H1 Heading" level={2} />);
    expect(container).toMatchSnapshot();
  });

  it("renders level 3", () => {
    const { container } = render(<Hero title="H1 Heading" level={3} />);
    expect(container).toMatchSnapshot();
  });

  it("renders level 1 with keyline for brand ", () => {
    process.env.GATSBY_ENABLE_BRAND_PROVIDER = "true";

    const { container } = render(
      <Hero title="H1 Heading" level={3} brand="Brand Name" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders level 1 with keyline for brand if brand", () => {
    process.env.GATSBY_ENABLE_BRAND_PROVIDER = "false";

    const { container } = render(
      <Hero title="H1 Heading" level={3} brand="Brand Name" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders level 0 with keyline for brand ", () => {
    process.env.GATSBY_ENABLE_BRAND_PROVIDER = "true";

    const { container } = render(
      <Hero
        heroes={[
          {
            title: "Title",
            imageSource,
            children: ""
          }
        ]}
        level={0}
        brand="Brand Name"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with no underline for brand", () => {
    process.env.GATSBY_ENABLE_BRAND_PROVIDER = "true";

    const { container } = render(
      <Hero
        heroes={[
          {
            title: "Title",
            imageSource,
            children: "",
            hasUnderline: false
          }
        ]}
        level={0}
        brand="Brand Name"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
