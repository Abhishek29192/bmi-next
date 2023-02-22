import { FormContext, ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import data from "../../samples/data.json";
import TileSelection from "../_TileSelection";

const dimensionsSample = {
  A: "10",
  B: "5",
  P1: "20",
  P2: "21"
};

describe("PitchedRoofCalculator TileSelection component", () => {
  it("renders correctly", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    const select = jest.fn();

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
            <TileSelection
              select={select}
              selected={undefined}
              dimensions={dimensionsSample}
              tiles={data.mainTiles as any[]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with no tiles", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    const select = jest.fn();

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
            <TileSelection
              select={select}
              selected={undefined}
              dimensions={dimensionsSample}
              tiles={[]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
