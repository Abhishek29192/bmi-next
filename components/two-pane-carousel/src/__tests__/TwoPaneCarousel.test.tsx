import React from "react";
import mediaQuery from "css-mediaquery";
import { render, cleanup, fireEvent } from "@testing-library/react";
import snapshotDiff from "snapshot-diff";
import imageSource from "test-image.jpg";
import BrandIcon from "brand-logo.svg";
import mockConsole from "jest-mock-console";
import TwoPaneCarousel from "../";
import { Props } from "../types";

beforeAll(() => {
  mockConsole();
});

const createMatchMedia = (width: number) => {
  return (query: string): MediaQueryList =>
    ({
      matches: mediaQuery.match(query, { width }),
      addListener: () => {},
      removeListener: () => {}
    } as unknown as MediaQueryList);
};

const slides: Props["slides"] = [
  {
    brandIcon: BrandIcon,
    title: "H1 Heading running onto 2 lines",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula nisi, condimentum facilisis hendrerit eget, sollicitudin non sapien. Class aptent taciti sociosqu ad litora.",
    cta: {
      label: "Read the full story"
    },
    media: <img src={imageSource} alt="Lorem ipsum" />
  },
  {
    title: "H1 Heading",
    description:
      "Aliquip velit exercitation sunt eiusmod. Ipsum est quis dolore cupidatat nisi reprehenderit aliquip exercitation. Magna mollit Lorem est aliqua consequat officia cillum dolor.",
    media: <img src={imageSource} alt="Lorem ipsum" />
  },
  {
    title: "H1 Heading",
    description: "Aliquip velit exercitation sunt eiusmod.",
    cta: {
      label: "Read the full story"
    },
    // TODO: This tests the deprecated imageSource
    imageSource
  },
  {
    title: "H1 Heading",
    media: <img src={imageSource} alt="Lorem ipsum" />
  }
];

afterEach(cleanup);
describe("TwoPaneCarousel component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders a single pane carousel", () => {
    window.matchMedia = createMatchMedia(1280);

    const { container } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    expect(container).toMatchSnapshot();
  });
  it("navigates to next page", () => {
    const nextLabel = "next";
    const { container, getByLabelText } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    const containerBeforeClick = container!.cloneNode(true);

    fireEvent.click(getByLabelText(nextLabel));

    expect(snapshotDiff(containerBeforeClick, container)).toMatchSnapshot();
  });
  it("navigates to previous page", () => {
    window.matchMedia = createMatchMedia(1280);
    const previousLabel = "previous";
    const { container, getByLabelText } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    const containerBeforeClick = container.cloneNode(true);

    fireEvent.click(getByLabelText(previousLabel));

    expect(snapshotDiff(containerBeforeClick, container)).toMatchSnapshot();
  });
  it("navigates to next page on mobile", () => {
    window.matchMedia = createMatchMedia(480);
    const nextLabel = "next";
    const { container, getByLabelText } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    const containerBeforeClick = container.cloneNode(true);

    fireEvent.click(getByLabelText(nextLabel));

    expect(snapshotDiff(containerBeforeClick, container)).toMatchSnapshot();
  });
  it("navigates to previous page on mobile", () => {
    window.matchMedia = createMatchMedia(480);
    const previousLabel = "previous";
    const { container, getByLabelText } = render(
      <TwoPaneCarousel slides={slides}>Lorem ipsum</TwoPaneCarousel>
    );
    const containerBeforeClick = container!.cloneNode(true);

    fireEvent.click(getByLabelText(previousLabel));

    expect(snapshotDiff(containerBeforeClick, container)).toMatchSnapshot();
  });
});
