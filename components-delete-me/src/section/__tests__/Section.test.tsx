import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import Section from "../Section";

describe("Section component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Section>Hello world.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly a white section", () => {
    const { container } = renderWithThemeProvider(
      <Section backgroundColor="white">Hello world.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("does not render nested section components", () => {
    const { container } = renderWithThemeProvider(
      <Section>
        <Section>Hello world.</Section>
      </Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with a title", () => {
    const { container } = renderWithThemeProvider(
      <Section>
        <Section.Title>H2 Heading</Section.Title>
        Hello world.
      </Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with a custom className", () => {
    const { container } = renderWithThemeProvider(
      <Section className="test">
        <Section.Title>H2 Heading</Section.Title>
        Hello world.
      </Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with slim === true", () => {
    const { container } = renderWithThemeProvider(
      <Section isSlim>Hello world.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with overflow visible", () => {
    const { container } = renderWithThemeProvider(
      <Section overflowVisible>Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with spacing none", () => {
    const { container } = renderWithThemeProvider(
      <Section spacing="none">Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly as with size === 'lg'", () => {
    const { container } = renderWithThemeProvider(
      <Section size="lg">Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with id", () => {
    const { container } = renderWithThemeProvider(
      <Section id="id">Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with hasNoPadding", () => {
    const { container } = renderWithThemeProvider(
      <Section hasNoPadding={true}>Hey, I like to over flow.</Section>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly if rendered as dialog", () => {
    const { container } = renderWithThemeProvider(
      <Section isDialog>Not a section class applied</Section>
    );
    expect(container.querySelector(".Section")).toBeNull();
  });
});
