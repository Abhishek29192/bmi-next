import React from "react";
import mediaQuery from "css-mediaquery";
import TwoPaneCarousel from "../";
import { Props } from "../types";
import { render, cleanup, fireEvent } from "@testing-library/react";
import snapshotDiff from "snapshot-diff";
import imageSource from "test-image.jpg";
import BrandIcon from "brand-logo.svg";

function createMatchMedia(width?: unknown) {
  return (query: string) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {}
  });
}

const slides: Props["slides"] = [
  {
    brandIcon: BrandIcon,
    title: "H1 Heading running onto 2 lines",
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula nisi, condimentum facilisis hendrerit eget, sollicitudin non sapien. Class aptent taciti sociosqu ad litora.",
    CTA: {
      label: "Read the full story"
    },
    imageSource
  },
  {
    title: "H1 Heading",
    children:
      "Aliquip velit exercitation sunt eiusmod. Ipsum est quis dolore cupidatat nisi reprehenderit aliquip exercitation. Magna mollit Lorem est aliqua consequat officia cillum dolor.",
    imageSource
  },
  {
    title: "H1 Heading",
    children: "Aliquip velit exercitation sunt eiusmod.",
    CTA: {
      label: "Read the full story"
    },
    imageSource
  }
];

afterEach(cleanup);
describe("TwoPaneCarousel component", () => {
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(jest.fn());
  });
  it("renders correctly", () => {
    const { container } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a single pane carousel", () => {
    // @ts-ignore Only used for testing.
    window.matchMedia = createMatchMedia(1280);

    const { container } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("navigates to next page", () => {
    const nextLabel = "next";
    const { container, getByLabelText } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    const containerBeforeClick = container.firstChild.cloneNode(true);

    fireEvent.click(getByLabelText(nextLabel));

    expect(
      snapshotDiff(containerBeforeClick, container.firstChild)
    ).toMatchSnapshot();
  });
  it("navigates to previous page", () => {
    const previousLabel = "previous";
    const { container, getByLabelText } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    const containerBeforeClick = container.firstChild.cloneNode(true);

    fireEvent.click(getByLabelText(previousLabel));

    expect(
      snapshotDiff(containerBeforeClick, container.firstChild)
    ).toMatchSnapshot();
  });
});
