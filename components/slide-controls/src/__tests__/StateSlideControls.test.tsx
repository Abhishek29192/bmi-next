import React from "react";
import { StateSlideControls as SlideControls } from "../";
import { render, fireEvent, cleanup } from "@testing-library/react";

afterEach(cleanup);

describe("SlideControls component", () => {
  it("renders correctly", () => {
    const { container } = render(<SlideControls total={5} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("moves forward from 1 to 2", () => {
    const nextLabel = "next";
    const { container, getByLabelText } = render(
      <SlideControls current={1} total={5} nextLabel={nextLabel} />
    );

    fireEvent.click(getByLabelText(nextLabel));

    expect(container.firstChild).toMatchSnapshot();
  });
  it("moves backward from 5 to 4", () => {
    const previousLabel = "previous";
    const { container, getByLabelText } = render(
      <SlideControls current={5} total={5} previousLabel={previousLabel} />
    );

    fireEvent.click(getByLabelText(previousLabel));

    expect(container.firstChild).toMatchSnapshot();
  });
  it("moves from last to first number", () => {
    const nextLabel = "next";
    const { container, getByLabelText } = render(
      <SlideControls current={5} total={5} nextLabel={nextLabel} />
    );

    fireEvent.click(getByLabelText(nextLabel));

    expect(container.firstChild).toMatchSnapshot();
  });
  it("moves from first to last number", () => {
    const previousLabel = "previous";
    const { container, getByLabelText } = render(
      <SlideControls current={1} total={5} previousLabel={previousLabel} />
    );

    fireEvent.click(getByLabelText(previousLabel));

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
});
