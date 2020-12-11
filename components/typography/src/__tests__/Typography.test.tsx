import React from "react";
import Typography from "../";
import { render } from "@testing-library/react";

describe("Typography component", () => {
  it("renders correctly", () => {
    const { container } = render(<Typography>Hello World</Typography>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders body2 correctly", () => {
    const { container } = render(
      <Typography variant="body2">Hello World</Typography>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders body3 correctly", () => {
    const { container } = render(
      <Typography variant="body3">Hello World</Typography>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders h1 correctly", () => {
    const { container } = render(<Typography variant="h1">Heading</Typography>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders h1 with underline", () => {
    const { container } = render(
      <Typography variant="h1" hasUnderline>
        Heading
      </Typography>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders h2 correctly", () => {
    const { container } = render(<Typography variant="h2">Heading</Typography>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders h3 correctly", () => {
    const { container } = render(<Typography variant="h3">Heading</Typography>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders h4 correctly", () => {
    const { container } = render(<Typography variant="h4">Heading</Typography>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders h5 correctly", () => {
    const { container } = render(<Typography variant="h5">Heading</Typography>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders h6 correctly", () => {
    const { container } = render(<Typography variant="h6">Heading</Typography>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders subtitle1 correctly", () => {
    const { container } = render(
      <Typography variant="subtitle1">Hello World</Typography>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders subtitle2 correctly", () => {
    const { container } = render(
      <Typography variant="subtitle2">Hello World</Typography>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders button correctly", () => {
    const { container } = render(
      <Typography variant="button">Button</Typography>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders caption correctly", () => {
    const { container } = render(
      <Typography variant="caption">Caption</Typography>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders overline correctly", () => {
    const { container } = render(
      <Typography variant="overline">Overline</Typography>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
