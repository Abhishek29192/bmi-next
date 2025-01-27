import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import CalculatorStepper from "../CalculatorStepper";

describe("CalculatorStepper component", () => {
  const SelectingARoof = () => {
    return (
      <div>
        <p>This is the Selecting a Roof Shape page.</p>
      </div>
    );
  };

  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel="Go Back"
            backButtonOnClick={jest.fn()}
            linkLabel="Skip"
            linkOnClick={jest.fn()}
            nextLabel="Calculate"
            nextButtonOnClick={jest.fn()}
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("disables 'Next' button if disableNextButton===true", () => {
    render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            disableNextButton={true}
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel="Go Back"
            backButtonOnClick={jest.fn()}
            linkLabel="Skip"
            linkOnClick={jest.fn()}
            nextLabel="Next button label"
            nextButtonOnClick={jest.fn()}
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );
    expect(
      screen.getByRole("button", { name: "Next button label" })
    ).toBeDisabled();
  });

  it("should not disable 'Next' button if disableNextButton===false", () => {
    render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            disableNextButton={false}
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel="Go Back"
            backButtonOnClick={jest.fn()}
            linkLabel="Skip"
            linkOnClick={jest.fn()}
            nextLabel="Next button label"
            nextButtonOnClick={jest.fn()}
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );
    expect(
      screen.getByRole("button", { name: "Next button label" })
    ).not.toBeDisabled();
  });

  it("should not disable 'Next' button if disableNextButton===undefined", () => {
    render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            disableNextButton={undefined}
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel="Go Back"
            backButtonOnClick={jest.fn()}
            linkLabel="Skip"
            linkOnClick={jest.fn()}
            nextLabel="Next button label"
            nextButtonOnClick={jest.fn()}
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );
    expect(
      screen.getByRole("button", { name: "Next button label" })
    ).not.toBeDisabled();
  });

  it("renders as a div", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            isForm={false}
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel="Go Back"
            backButtonOnClick={jest.fn()}
            linkLabel="Skip"
            linkOnClick={jest.fn()}
            nextLabel="Calculate"
            nextButtonOnClick={jest.fn()}
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("ignores footer when there are no buttons", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("calls button events", () => {
    const onClickBack = jest.fn();
    const backLabel = "Go Back";

    const onClickLink = jest.fn();
    const linkLabel = "Skip";

    const onClickNext = jest.fn();
    const nextLabel = "Calculate";

    render(
      <ThemeProvider>
        {" "}
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel={backLabel}
            backButtonOnClick={onClickBack}
            linkLabel={linkLabel}
            linkOnClick={onClickLink}
            nextLabel={nextLabel}
            nextButtonOnClick={onClickNext}
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );

    const backButton = screen.getByText(backLabel);
    fireEvent.click(backButton);
    expect(onClickBack).toHaveBeenCalled();

    const linkButton = screen.getByText(linkLabel);
    fireEvent.click(linkButton);
    expect(onClickLink).toHaveBeenCalled();

    const nextButton = screen.getByText(nextLabel);
    fireEvent.click(nextButton);
    expect(onClickNext).toHaveBeenCalled();
  });

  it("renders correctly with sm paddings", () => {
    render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel={undefined}
            backButtonOnClick={jest.fn()}
            linkLabel={undefined}
            linkOnClick={jest.fn()}
            nextLabel="Next button"
            nextButtonOnClick={jest.fn()}
            isForm
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );

    const form = screen.getByTestId("calculator-step-form");
    expect(
      form.classList.contains("CalculatorStepper-form-sm-padding")
    ).toBeTruthy();
  });

  it("renders correctly with md paddings", () => {
    render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel={undefined}
            backButtonOnClick={jest.fn()}
            linkLabel="Link label"
            linkOnClick={jest.fn()}
            nextLabel="Next button"
            nextButtonOnClick={jest.fn()}
            isForm
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );

    const form = screen.getByTestId("calculator-step-form");
    expect(
      form.classList.contains("CalculatorStepper-form-md-padding")
    ).toBeTruthy();
  });

  it("renders correctly with large paddings", () => {
    render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel="Back label"
            backButtonOnClick={jest.fn()}
            linkLabel="Link label"
            linkOnClick={jest.fn()}
            nextLabel="Next button"
            nextButtonOnClick={jest.fn()}
            isForm
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );

    const form = screen.getByTestId("calculator-step-form");
    expect(
      form.classList.contains("CalculatorStepper-form-lg-padding")
    ).toBeTruthy();
  });

  it("renders correctly on mobile devices", () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      onchange: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn()
    }));

    const nextButtonLabel = "Next button label";
    const linkLabel = "Link button label";
    const backButtonLabel = "Back button label";

    render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={false}>
          <CalculatorStepper.Step
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel={backButtonLabel}
            backButtonOnClick={jest.fn()}
            linkLabel={linkLabel}
            linkOnClick={jest.fn()}
            nextLabel={nextButtonLabel}
            nextButtonOnClick={jest.fn()}
            isForm
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0].textContent).toBe(nextButtonLabel);
    expect(buttons[1].textContent).toBe(backButtonLabel);
    expect(buttons[2].textContent).toBe(linkLabel);
  });

  it("renders with loader", () => {
    render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape" loading={true}>
          <CalculatorStepper.Step
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
