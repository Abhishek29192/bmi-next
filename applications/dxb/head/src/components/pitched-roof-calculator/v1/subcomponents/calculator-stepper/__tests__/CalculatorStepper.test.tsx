import { ThemeProvider } from "@bmi-digital/components";
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
        <CalculatorStepper selected="select-a-roof-shape">
          <CalculatorStepper.Step
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel="Go Back"
            backButtonOnClick={() => {}}
            linkLabel="Skip"
            linkOnClick={() => {}}
            nextLabel="Calculate"
            nextButtonOnClick={() => {}}
          >
            <SelectingARoof />
          </CalculatorStepper.Step>
        </CalculatorStepper>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders as a div", () => {
    const { container } = render(
      <ThemeProvider>
        <CalculatorStepper selected="select-a-roof-shape">
          <CalculatorStepper.Step
            isForm={false}
            key="select-a-roof-shape"
            title="This is the 2nd page"
            subtitle="Choose the closest to your roof shape"
            backLabel="Go Back"
            backButtonOnClick={() => {}}
            linkLabel="Skip"
            linkOnClick={() => {}}
            nextLabel="Calculate"
            nextButtonOnClick={() => {}}
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
        <CalculatorStepper selected="select-a-roof-shape">
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
        <CalculatorStepper selected="select-a-roof-shape">
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
});
