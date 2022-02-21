import React from "react";
import { render } from "@testing-library/react";
import Section from "../Section";

describe("Section component", () => {
  it("renders correctly", () => {
    const { container } = render(<Section>Hello world.</Section>);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly a white section", () => {
    const { container } = render(
      <Section backgroundColor="white">Hello world.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("does not render nested section components", () => {
    const { container } = render(
      <Section>
        <Section>Hello world.</Section>
      </Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with a title", () => {
    const { container } = render(
      <Section>
        <Section.Title>H2 Heading</Section.Title>
        Hello world.
      </Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with a custom className", () => {
    const { container } = render(
      <Section className="test">
        <Section.Title>H2 Heading</Section.Title>
        Hello world.
      </Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with slim === true", () => {
    const { container } = render(<Section isSlim>Hello world.</Section>);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with overflow visible", () => {
    const { container } = render(
      <Section overflowVisible>Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with spacing none", () => {
    const { container } = render(
      <Section spacing="none">Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly as with size === 'lg'", () => {
    const { container } = render(
      <Section size="lg">Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with id", () => {
    const { container } = render(
      <Section id="id">Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with hasNoPadding", () => {
    const { container } = render(
      <Section hasNoPadding={true}>Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });
});
