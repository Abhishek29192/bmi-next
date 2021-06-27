import React from "react";
import { render } from "@testing-library/react";
import { MicroCopy } from "../helpers/microCopy";
import data from "../samples/data.json";
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
          data={data as any}
        />
      </MicroCopy.Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
