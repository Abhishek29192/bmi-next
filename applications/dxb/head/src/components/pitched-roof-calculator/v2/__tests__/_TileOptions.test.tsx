import { FormContext } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import data from "../../samples/v2/data.json";
import { MainTileVariant } from "../../types/v2";
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
            variant={data.mainTiles[0].variants[0] as MainTileVariant}
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
            variant={
              {
                ...data.mainTiles[0].variants[0],
                vergeOptions: [],
                ridgeOptions: [],
                ventilationHoodOptions: []
              } as MainTileVariant
            }
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("selects ridge tile by default", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;
    const ridge = data.mainTiles[0].variants[0].ridgeOptions[0];

    render(
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
            variant={
              {
                ...data.mainTiles[0].variants[0],
                ridgeOptions: [ridge]
              } as MainTileVariant
            }
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(updateFormState).toBeCalledWith({
      ridge: ridge.externalProductCode
    });
  });
});
