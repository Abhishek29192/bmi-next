import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import mockLogo from "mock-icon.svg";
import React from "react";
import CalculatorModal from "../CalculatorModal";

describe("CalculatorModal component", () => {
  it("renders correctly", () => {
    const { baseElement } = render(
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
    expect(baseElement).toMatchSnapshot();
  });

  it("renders with pearl background", () => {
    const { baseElement } = render(
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
    expect(baseElement).toMatchSnapshot();
  });

  it("renders closed", () => {
    const { baseElement } = render(
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
    expect(baseElement).toMatchSnapshot();
  });

  it("calls the close event", () => {
    const closeLabel = "Close";

    const onCloseClick = jest.fn();

    render(
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

    const closeButton = screen.getByLabelText(closeLabel);
    fireEvent.click(closeButton);
    expect(onCloseClick).toHaveBeenCalled();
  });

  it("renders with no logo", () => {
    const { baseElement } = render(
      <ThemeProvider>
        <CalculatorModal
          headerCentre="Some Central Content"
          onCloseClick={jest.fn()}
        >
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "data-testid": "test-backdrop"
          }}
        >
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("test-backdrop"));
    expect(onBackdropClick).toHaveBeenCalled();
  });

  it("renders with backdropProps", () => {
    const onCloseClick = jest.fn();
    const { baseElement } = render(
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
    expect(baseElement).toMatchSnapshot();
  });

  it("renders with ariaLabelledby props", () => {
    const { baseElement } = render(
      <ThemeProvider>
        <CalculatorModal ariaLabelledby="modal-test" onCloseClick={jest.fn()}>
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("renders with ariaDescribedby props", () => {
    const { baseElement } = render(
      <ThemeProvider>
        <CalculatorModal ariaDescribedby="modal-test" onCloseClick={jest.fn()}>
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("renders with className", () => {
    const { baseElement } = render(
      <ThemeProvider>
        <CalculatorModal className="custom-class-name" onCloseClick={jest.fn()}>
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("renders with disablePortal", () => {
    const { baseElement } = render(
      <ThemeProvider>
        <CalculatorModal disablePortal={false} onCloseClick={jest.fn()}>
          Some content
        </CalculatorModal>
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
