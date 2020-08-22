import React from "react";
import Hero from "../";
import { render } from "@testing-library/react";
import imageSource from "mock-image.jpg";

describe("Hero component", () => {
  it("renders level 1", () => {
    const { container } = render(
      <Hero imageSource={imageSource} title="H1 Heading" level={1}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non
        tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus
        suscipit dolor nisl, nec vestibulum odio molestie tincidunt.
      </Hero>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders level 2", () => {
    const { container } = render(<Hero title="H1 Heading" level={2} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders level 3", () => {
    const { container } = render(<Hero title="H1 Heading" level={3} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
