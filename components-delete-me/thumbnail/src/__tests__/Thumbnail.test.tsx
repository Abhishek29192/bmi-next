import React from "react";
import { render } from "@testing-library/react";
import mockImage from "path-to-img.jpg";
import Thumbnail from "../";

describe("Thumbnail component", () => {
  it("renders correctly", () => {
    const { container } = render(<Thumbnail altText="Blue" color="#33b2e9" />);
    expect(container).toMatchSnapshot();
  });
  it("renders with large size", () => {
    const { container } = render(
      <Thumbnail altText="Black" color="#000" size="large" />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders selected", () => {
    const { container } = render(
      <Thumbnail altText="Black" state="selected" />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders disabled", () => {
    const { container } = render(
      <Thumbnail altText="Black" state="disabled" />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with an image", () => {
    const { container } = render(
      <Thumbnail altText="Black" state="disabled" imageSource={mockImage} />
    );
    expect(container).toMatchSnapshot();
  });
});
