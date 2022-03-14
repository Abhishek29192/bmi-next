import { FormContext, ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import data from "../../samples/data.json";
import UnderlaySelection from "../_UnderlaySelection";

const dimensionsSample = {
  A: "10",
  B: "5",
  P1: "20",
  P2: "21"
};

describe("PitchedRoofCalculator UnderlaySelection component", () => {
  it("renders correctly", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    const { container } = render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <FormContext.Provider
            value={{
              updateFormState,
              hasBeenSubmitted,
              submitButtonDisabled,
              values: {}
            }}
          >
            <UnderlaySelection
              selected={undefined}
              dimensions={dimensionsSample}
              options={data.underlays}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with no options", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    const { container } = render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <FormContext.Provider
            value={{
              updateFormState,
              hasBeenSubmitted,
              submitButtonDisabled,
              values: {}
            }}
          >
            <UnderlaySelection
              selected={undefined}
              dimensions={dimensionsSample}
              options={[]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
