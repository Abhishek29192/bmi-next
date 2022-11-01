import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import React from "react";
import CalculatorStepper from "../CalculatorStepper";

beforeAll(() => {
  mockConsole();
});

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

    const { getByText } = render(
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

    const backButton = getByText(backLabel);
    fireEvent.click(backButton);
    expect(onClickBack.mock.calls).toMatchSnapshot();

    const linkButton = getByText(linkLabel);
    fireEvent.click(linkButton);
    expect(onClickLink.mock.calls).toMatchSnapshot();

    const nextButton = getByText(nextLabel);
    fireEvent.click(nextButton);
    expect(onClickNext.mock.calls).toMatchSnapshot();
  });
});
