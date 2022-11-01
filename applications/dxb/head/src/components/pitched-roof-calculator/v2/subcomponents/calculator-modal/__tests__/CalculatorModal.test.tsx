import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render } from "@testing-library/react";
import mockLogo from "mock-icon.svg";
import React from "react";
import CalculatorModal from "../CalculatorModal";

describe("CalculatorModal component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorModal
          headerCentre="Some Central Content"
          logo={mockLogo}
          open
          onCloseClick={jest.fn()}
        >
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders with pearl background", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorModal
          headerCentre="Some Central Content"
          logo={mockLogo}
          open
          onCloseClick={jest.fn()}
          pearl
        >
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders closed", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorModal
          headerCentre="Some Central Content"
          logo={mockLogo}
          onCloseClick={jest.fn()}
        >
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("calls the close event", () => {
    const closeLabel = "Close";

    const onCloseClick = jest.fn();

    const { getByLabelText } = render(
      <ThemeProvider>
        <CalculatorModal
          headerCentre="Some Central Content"
          logo={mockLogo}
          open
          onCloseClick={onCloseClick}
        >
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );

    const closeButton = getByLabelText(closeLabel);
    closeButton.click();
    expect(onCloseClick).toHaveBeenCalled();
  });

  it("renders with no logo", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorModal
          headerCentre="Some Central Content"
          onCloseClick={jest.fn()}
        >
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("calls the onBackdropClick event", () => {
    const onCloseClick = jest.fn();
    const onBackdropClick = jest.fn();
    render(
      <ThemeProvider>
        <CalculatorModal
          open
          onCloseClick={onCloseClick}
          onBackdropClick={onBackdropClick}
          backdropProps={{
            className: "test-backdrop"
          }}
        >
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    fireEvent.click(document.querySelector(".test-backdrop")!);
    expect(onBackdropClick).toHaveBeenCalled();
  });

  it("renders with backdropProps", () => {
    const onCloseClick = jest.fn();
    const { container } = render(
      <ThemeProvider>
        <CalculatorModal
          open
          onCloseClick={onCloseClick}
          backdropProps={{
            className: "test-backdrop"
          }}
        >
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders with ariaLabelledby props", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorModal ariaLabelledby="modal-test" onCloseClick={jest.fn()}>
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders with ariaDescribedby props", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorModal ariaDescribedby="modal-test" onCloseClick={jest.fn()}>
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders with className", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorModal className="custom-class-name" onCloseClick={jest.fn()}>
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders with disablePortal", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorModal disablePortal={false} onCloseClick={jest.fn()}>
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(container.parentElement).toMatchSnapshot();
  });
});
