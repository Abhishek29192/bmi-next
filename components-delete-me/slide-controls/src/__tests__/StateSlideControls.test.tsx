import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { StateSlideControls as SlideControls } from "../";

afterEach(cleanup);

describe("SlideControls component", () => {
  it("renders correctly", () => {
    const { container } = render(<SlideControls total={5} />);
    expect(container).toMatchSnapshot();
  });
  it("moves forward from 1 to 2", () => {
    const nextLabel = "next";
    const { container, getByLabelText } = render(
      <SlideControls current={1} total={5} nextLabel={nextLabel} />
    );

    fireEvent.click(getByLabelText(nextLabel));

    expect(container).toMatchSnapshot();
  });
  it("moves backward from 5 to 4", () => {
    const previousLabel = "previous";
    const { container, getByLabelText } = render(
      <SlideControls current={5} total={5} previousLabel={previousLabel} />
    );

    fireEvent.click(getByLabelText(previousLabel));

    expect(container).toMatchSnapshot();
  });
  it("moves from last to first number", () => {
    const nextLabel = "next";
    const { container, getByLabelText } = render(
      <SlideControls current={5} total={5} nextLabel={nextLabel} />
    );

    fireEvent.click(getByLabelText(nextLabel));

    expect(container).toMatchSnapshot();
  });
  it("moves from first to last number", () => {
    const previousLabel = "previous";
    const { container, getByLabelText } = render(
      <SlideControls current={1} total={5} previousLabel={previousLabel} />
    );

    fireEvent.click(getByLabelText(previousLabel));

    expect(container).toMatchSnapshot();
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

    expect(onPrevClick).toBeCalledTimes(1);
  });

  it("triggers a onPrevClick event and onChange", () => {
    const onPrevClick = jest.fn();
    const onChange = jest.fn();
    const previousLabel = "previous";
    const { getByLabelText } = render(
      <SlideControls
        onChange={onChange}
        current={1}
        total={5}
        previousLabel={previousLabel}
        onPrevClick={onPrevClick}
      />
    );

    fireEvent.click(getByLabelText(previousLabel));

    expect(onChange).toBeCalledTimes(1);
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

    expect(onNextClick).toBeCalledTimes(1);
  });

  it("triggers a onNextClick event and onChange", () => {
    const onChange = jest.fn();
    const onNextClick = jest.fn();
    const nextLabel = "next";
    const { getByLabelText } = render(
      <SlideControls
        onChange={onChange}
        current={1}
        total={5}
        nextLabel={nextLabel}
        onNextClick={onNextClick}
      />
    );

    fireEvent.click(getByLabelText(nextLabel));

    expect(onChange).toBeCalledTimes(1);
  });
});
