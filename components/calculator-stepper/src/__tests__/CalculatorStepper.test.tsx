import React from "react";
import CalculatorStepper from "../";
import { render } from "@testing-library/react";

describe("CalculatorStepper component", () => {
  it("renders correctly", () => {
    const SelectingARoof = () => {
      return (
        <div>
          <p>This is the Selecting a Roof Shape page.</p>
        </div>
      );
    };
    const { container } = render(
      <CalculatorStepper selected="select-a-roof-shape">
        <CalculatorStepper.Step
          value="select-a-roof-shape"
          title="This is the 2nd page"
          subtitle="Choose the closest to your roof shape"
          backButtonLabel="Go Back"
          backButtonOnClick={() => {}}
          linkLabel="Skip"
          linkOnClick={() => {}}
          nextLabel="Calculate"
          nextButtonOnClick={() => {}}
        >
          <SelectingARoof />
        </CalculatorStepper.Step>
      </CalculatorStepper>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
