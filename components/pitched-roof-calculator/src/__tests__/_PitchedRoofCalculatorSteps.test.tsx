import React from "react";
import { render } from "@testing-library/react";
import { MicroCopy } from "../helpers/microCopy";
import en from "../samples/copy/en.json";
import PitchedRoofCalculatorSteps from "../_PitchedRoofCalculatorSteps";

describe("PitchedRoofCalculatorSteps component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculatorSteps
          selected="select-roof"
          setSelected={jest.fn()}
          sendEmailAddress={jest.fn()}
        />
      </MicroCopy.Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
