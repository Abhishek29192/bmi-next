import React from "react";
import { render } from "@testing-library/react";
import { FormContext } from "@bmi-digital/components";
import { MicroCopy } from "../helpers/microCopy";
import en from "../samples/copy/en.json";
import data from "../samples/data.json";
import TileOptions from "../_TileOptions";

describe("PitchedRoofCalculator TileOptions component", () => {
  it("renders correctly", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    const { container } = render(
      <MicroCopy.Provider values={en}>
        <FormContext.Provider
          value={{
            updateFormState,
            hasBeenSubmitted,
            submitButtonDisabled,
            values: {}
          }}
        >
          <TileOptions
            selections={{}}
            variant={data.mainTiles[0].variants[0] as any}
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with no options", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    const { container } = render(
      <MicroCopy.Provider values={en}>
        <FormContext.Provider
          value={{
            updateFormState,
            hasBeenSubmitted,
            submitButtonDisabled,
            values: {}
          }}
        >
          <TileOptions
            selections={{}}
            variant={
              {
                ...data.mainTiles[0].variants[0],
                vergeOptions: [],
                ridgeOptions: [],
                ventilationHoodOptions: []
              } as any
            }
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
