import React from "react";
import { render } from "@testing-library/react";
import Section from "../";

describe("Section component", () => {
  it("renders correctly", () => {
    const { container } = render(<Section>Hello world.</Section>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a white section", () => {
    const { container } = render(
      <Section backgroundColor="white">Hello world.</Section>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("does not render nested section components", () => {
    const { container } = render(
      <Section>
        <Section>Hello world.</Section>
      </Section>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with a title", () => {
    const { container } = render(
      <Section>
        <Section.Title>H2 Heading</Section.Title>
        Hello world.
      </Section>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with a custom className", () => {
    const { container } = render(
      <Section className="test">
        <Section.Title>H2 Heading</Section.Title>
        Hello world.
      </Section>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders as slim", () => {
    const { container } = render(<Section isSlim>Hello world.</Section>);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders as with overflow visible", () => {
    const { container } = render(
      <Section overflowVisible>Hey, I like to over flow.</Section>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
