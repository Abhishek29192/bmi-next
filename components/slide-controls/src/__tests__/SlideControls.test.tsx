import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import snapshotDiff from "snapshot-diff";
import SlideControls from "../";

afterEach(cleanup);

describe("SlideControls component", () => {
  it("renders correctly", () => {
    const { container } = render(<SlideControls total={5} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders the total number when current is more than total", () => {
    const { container } = render(<SlideControls current={7} total={5} />);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders vertically", () => {
    const { container } = render(
      <SlideControls current={1} total={5} isVertical />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders full size", () => {
    const { container } = render(
      <SlideControls current={1} total={5} isFullSize isVertical />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders a dark themed", () => {
    const { container } = render(
      <SlideControls current={1} total={5} isDarkThemed />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it("doesn't apply the full size class, when vertical", () => {
    const { container } = render(
      <SlideControls current={1} total={5} isFullSize isVertical />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it("triggers a onPrevClick event", () => {
    const onPrevClick = jest.fn();
    const previousLabel = "previous";
    const { getByLabelText } = render(
      <SlideControls
        current={1}
        total={5}
        previousLabel={previousLabel}
        onPrevClick={onPrevClick}
      />
    );

    fireEvent.click(getByLabelText(previousLabel));

    expect(onPrevClick.mock.calls).toMatchSnapshot();
  });
  it("triggers a onNextClick event", () => {
    const onNextClick = jest.fn();
    const nextLabel = "next";
    const { getByLabelText } = render(
      <SlideControls
        current={1}
        total={5}
        nextLabel={nextLabel}
        onNextClick={onNextClick}
      />
    );

    fireEvent.click(getByLabelText(nextLabel));

    expect(onNextClick.mock.calls).toMatchSnapshot();
  });
  it("doesn't trigger onNextClick or onPrevClick events during the animation", () => {
    const onClick = jest.fn();
    const previousLabel = "previous";
    const nextLabel = "next";
    const { rerender, getByLabelText } = render(
      <SlideControls
        current={1}
        total={5}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        onPrevClick={onClick}
        onNextClick={onClick}
      />
    );

    rerender(
      <SlideControls
        current={2}
        total={5}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        onPrevClick={onClick}
        onNextClick={onClick}
      />
    );

    // NOTE: I'm not firing the AnimationEnd event, which means that it's still moving.

    fireEvent.click(getByLabelText(previousLabel));
    fireEvent.click(getByLabelText(nextLabel));

    expect(onClick.mock.calls).toMatchSnapshot();
  });
  it("doesn't call useless state change on animationEnd", () => {
    const { container, getByText } = render(
      <SlideControls current={1} total={5} />
    );
    const containerBeforeAnimationEnd = container.firstChild.cloneNode(true);

    fireEvent.animationEnd(getByText("01"));

    expect(
      snapshotDiff(containerBeforeAnimationEnd, container.firstChild)
    ).toMatchSnapshot();
  });
  it("moves forward by one number", () => {
    const { container, rerender, getByText } = render(
      <SlideControls current={1} total={5} />
    );

    rerender(<SlideControls current={2} total={5} />);

    fireEvent.animationEnd(getByText("02"));

    expect(container.firstChild).toMatchSnapshot();
  });
  it("moves backward by one number", () => {
    const { container, rerender, getByText } = render(
      <SlideControls current={2} total={5} />
    );

    rerender(<SlideControls current={1} total={5} />);

    fireEvent.animationEnd(getByText("01"));

    expect(container.firstChild).toMatchSnapshot();
  });
  it("moves from last to first number", () => {
    const { container, rerender, getByText } = render(
      <SlideControls current={5} total={5} />
    );

    rerender(<SlideControls current={1} total={5} />);

    fireEvent.animationEnd(getByText("01"));

    expect(container.firstChild).toMatchSnapshot();
  });
  it("moves from first to last number", () => {
    const { container, rerender, getAllByText } = render(
      <SlideControls current={1} total={5} />
    );

    rerender(<SlideControls current={5} total={5} />);

    // NOTE: Necessary because the total is the same as the current.
    fireEvent.animationEnd(getAllByText("05")[0]);

    expect(container.firstChild).toMatchSnapshot();
  });
});
