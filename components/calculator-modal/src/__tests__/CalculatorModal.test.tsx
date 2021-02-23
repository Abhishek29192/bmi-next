import React from "react";
import { render } from "@testing-library/react";
import mockLogo from "mock-icon.svg";
import CalculatorModal from "../";

describe("CalculatorModal component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <CalculatorModal
        headerCenter="Some Central Content"
        logo={mockLogo}
        open
        onCloseClick={jest.fn()}
      >
        Some content
      </CalculatorModal>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders with pearl background", () => {
    const { container } = render(
      <CalculatorModal
        headerCenter="Some Central Content"
        logo={mockLogo}
        open
        onCloseClick={jest.fn()}
        pearl
      >
        Some content
      </CalculatorModal>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders closed", () => {
    const { container } = render(
      <CalculatorModal
        headerCenter="Some Central Content"
        logo={mockLogo}
        onCloseClick={jest.fn()}
      >
        Some content
      </CalculatorModal>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("calls the close event", () => {
    const closeLabel = "Close";

    const onCloseClick = jest.fn();

    const { getByLabelText } = render(
      <CalculatorModal
        headerCenter="Some Central Content"
        logo={mockLogo}
        open
        onCloseClick={onCloseClick}
      >
        Some content
      </CalculatorModal>
    );

    const closeButton = getByLabelText(closeLabel);
    closeButton.click();
    expect(onCloseClick).toHaveBeenCalled();
  });
});
