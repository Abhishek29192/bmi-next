import React from "react";
import Thumbnail from "../";
import { render } from "@testing-library/react";
import mockImage from "path-to-img.jpg";

describe("Thumbnail component", () => {
  it("renders correctly", () => {
    const { container } = render(<Thumbnail altText="Blue" color="#33b2e9" />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with large size", () => {
    const { container } = render(
      <Thumbnail altText="Black" color="#000" size="large" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders selected", () => {
    const { container } = render(
      <Thumbnail altText="Black" state="selected" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders disabled", () => {
    const { container } = render(
      <Thumbnail altText="Black" state="disabled" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with an image", () => {
    const { container } = render(
      <Thumbnail altText="Black" state="disabled" imageSource={mockImage} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
