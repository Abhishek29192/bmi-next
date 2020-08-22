import React from "react";
import Carousel, { getPageFromAbsoluteIndex } from "../";
import { render, fireEvent, cleanup } from "@testing-library/react";
import snapshotDiff from "snapshot-diff";

afterEach(cleanup);
describe("Carousel component", () => {
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(jest.fn());
  });

  it("renders correctly", () => {
    const { container } = render(
      <Carousel isSwipeDisabled>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("navigates to next page", () => {
    const nextLabel = "next";
    const { container, getByLabelText } = render(
      <div>
        <Carousel isSwipeDisabled>
          <Carousel.Slide>First slide</Carousel.Slide>
          <Carousel.Slide>Second slide</Carousel.Slide>
          <Carousel.Slide>Third slide</Carousel.Slide>
          <Carousel.Controls nextLabel={nextLabel} />
        </Carousel>
      </div>
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
      <div>
        <Carousel isSwipeDisabled>
          <Carousel.Slide>First slide</Carousel.Slide>
          <Carousel.Slide>Second slide</Carousel.Slide>
          <Carousel.Slide>Third slide</Carousel.Slide>
          <Carousel.Controls previousLabel={previousLabel} />
        </Carousel>
      </div>
    );
    const containerBeforeClick = container.firstChild.cloneNode(true);

    fireEvent.click(getByLabelText(previousLabel));

    expect(
      snapshotDiff(containerBeforeClick, container.firstChild)
    ).toMatchSnapshot();
  });
  it("works when controlled", () => {
    const { container, rerender } = render(
      <Carousel initialPage={0}>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );
    const containerBeforeClick = container.firstChild.cloneNode(true);

    rerender(
      <Carousel initialPage={1}>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );

    expect(
      snapshotDiff(containerBeforeClick, container.firstChild)
    ).toMatchSnapshot();
  });
  // TODO: The way react-swiplable-views tests this is forcing the function call
  // which is not ideal. I wasn't able to figure out what event would trigger the function.
  it.skip("triggers an onPageChange event", () => {
    const onPageChange = jest.fn();

    const { rerender, getByText } = render(
      <Carousel initialPage={0} onPageChange={onPageChange}>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );

    rerender(
      <Carousel initialPage={1} onPageChange={onPageChange}>
        <Carousel.Slide>First slide</Carousel.Slide>
        <Carousel.Slide>Second slide</Carousel.Slide>
        <Carousel.Slide>Third slide</Carousel.Slide>
        <Carousel.Controls />
      </Carousel>
    );

    fireEvent.touchEnd(getByText("Second slide"));

    expect(onPageChange.mock.calls).toMatchSnapshot();
  });

  describe("getPageFromAbsoluteIndex function", () => {
    it("returns page number from index >= 0 and <= total", () => {
      expect(getPageFromAbsoluteIndex(0, 3)).toBe(1);

      expect(getPageFromAbsoluteIndex(1, 3)).toBe(2);

      expect(getPageFromAbsoluteIndex(2, 3)).toBe(3);
    });
    it("returns page number from index > total", () => {
      expect(getPageFromAbsoluteIndex(3, 3)).toBe(1);

      expect(getPageFromAbsoluteIndex(4, 3)).toBe(2);

      expect(getPageFromAbsoluteIndex(5, 3)).toBe(3);
    });
    it("returns page number from index < 0", () => {
      expect(getPageFromAbsoluteIndex(-1, 3)).toBe(3);

      expect(getPageFromAbsoluteIndex(-2, 3)).toBe(2);

      expect(getPageFromAbsoluteIndex(-3, 3)).toBe(1);
    });
  });
});
