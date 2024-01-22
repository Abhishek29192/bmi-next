import { FormContext } from "@bmi-digital/components/form";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import TileOptions from "../_TileOptions";
import { AnalyticsContext } from "../helpers/analytics";
import { MicroCopy } from "../helpers/microCopy";
import {
  RidgeOption,
  Tile,
  VentilationHood,
  VergeOption,
  VergeVariant
} from "../types";
import { createProduct } from "./helpers/createProduct";
import en from "./samples/copy/en.json";

const tileVariant = createProduct<Tile>({
  color: "red",
  category: "category",
  width: 20,
  brokenBond: false,
  maxBattenSpacing: 35,
  eaveGauge: 23,
  ridgeSpacing: 5,
  minBattenSpacing: 18,
  length: 30,
  packSize: 20
});

const ridgeTile = createProduct<RidgeOption>({
  name: "Ridge tile",
  externalProductCode: "ridge_tile",
  length: 30
});

const leftVergeTile = createProduct<VergeVariant>({
  name: "left verge",
  externalProductCode: "left_verge",
  width: 10,
  code: "left_verge"
});

const rightVergeTile = createProduct<VergeVariant>({
  name: "right verge",
  externalProductCode: "right_verge",
  width: 10,
  code: "right_verge"
});

const verge: VergeOption = {
  right: rightVergeTile,
  left: leftVergeTile
};

const ventilationHood = createProduct<VentilationHood>({
  name: "Ventilation hood",
  externalProductCode: "ventilation_hood"
});

const pushEvent = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe("PitchedRoofCalculator TileOptions component", () => {
  it("renders with no options", () => {
    render(
      <MicroCopy.Provider values={en}>
        <FormContext.Provider
          value={{
            updateFormState: jest.fn(),
            hasBeenSubmitted: false,
            submitButtonDisabled: false,
            values: {}
          }}
        >
          <TileOptions
            variant={{
              ...tileVariant,
              vergeOption: undefined,
              ridgeOptions: [],
              ventilationHoodOptions: []
            }}
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(
      screen.queryByText("MC: tileOptions.verge.title")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: tileOptions.ridge.title")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("MC: tileOptions.ventilationHood.title")
    ).not.toBeInTheDocument();
  });

  it("selects ridge tile by default", () => {
    const updateFormState = jest.fn();

    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <FormContext.Provider
            value={{
              updateFormState,
              hasBeenSubmitted: false,
              submitButtonDisabled: false,
              values: {}
            }}
          >
            <TileOptions
              variant={{
                ...tileVariant,
                ridgeOptions: [ridgeTile],
                vergeOptions: [],
                ventilationHoodOptions: []
              }}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(updateFormState).toBeCalledWith({
      ridge: ridgeTile.externalProductCode
    });
  });

  it("renders correctly with selected ventilation hood", () => {
    const updateFormState = jest.fn();

    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <FormContext.Provider
            value={{
              updateFormState,
              hasBeenSubmitted: false,
              submitButtonDisabled: false,
              values: {}
            }}
          >
            <TileOptions
              variant={{
                ...tileVariant,
                ridgeOptions: [],
                vergeOptions: [],
                ventilationHoodOptions: [ventilationHood]
              }}
              selections={{ ventilationHoods: [ventilationHood] }}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );
    expect(updateFormState).toHaveBeenCalledWith(
      {
        ventilation: [ventilationHood.externalProductCode]
      },
      //second argument is an empty object because updateFormState calls with no errors
      {}
    );
  });

  it("calls pushEvent", async () => {
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <FormContext.Provider
            value={{
              updateFormState: jest.fn(),
              hasBeenSubmitted: false,
              submitButtonDisabled: false,
              values: {}
            }}
          >
            <AnalyticsContext.Provider value={pushEvent}>
              <TileOptions
                selections={undefined}
                variant={{
                  ...tileVariant,
                  vergeOption: verge,
                  ridgeOptions: [
                    ridgeTile,
                    {
                      ...createProduct<RidgeOption>({
                        name: "Second ridge",
                        length: 25
                      })
                    }
                  ],
                  ventilationHoodOptions: [ventilationHood]
                }}
              />
            </AnalyticsContext.Provider>
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText(verge.left.name));
    await waitFor(() =>
      expect(pushEvent).toBeCalledWith({
        event: "dxb.button_click",
        id: "rc-options-accessories",
        label: verge.left.name,
        action: "selected"
      })
    );

    fireEvent.click(screen.getByText("MC: tileOptions.verge.noneLabel"));
    await waitFor(() =>
      expect(pushEvent).toHaveBeenLastCalledWith({
        event: "dxb.button_click",
        id: "rc-options-accessories",
        label: "MC: tileOptions.verge.noneLabel",
        action: "selected"
      })
    );

    fireEvent.click(screen.getByText(ridgeTile.name));
    await waitFor(() =>
      expect(pushEvent).toHaveBeenLastCalledWith({
        event: "dxb.button_click",
        id: "rc-options-accessories",
        label: `${ridgeTile.name} - MC: calculator.nobb.label: ${ridgeTile.externalProductCode}`,
        action: "selected"
      })
    );

    fireEvent.click(screen.getByText(ventilationHood.name));
    await waitFor(() =>
      expect(pushEvent).toHaveBeenLastCalledWith({
        event: "dxb.button_click",
        id: "rc-options-accessories",
        label: `${ventilationHood.name} - MC: calculator.nobb.label: ${ventilationHood.externalProductCode}`,
        action: "selected"
      })
    );
  });

  it("selects 'none' option for ventilation hoods", async () => {
    const updateFormState = jest.fn();

    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <FormContext.Provider
            value={{
              updateFormState: updateFormState,
              hasBeenSubmitted: false,
              submitButtonDisabled: false,
              values: {}
            }}
          >
            <TileOptions
              selections={{ ventilationHoods: "none" }}
              variant={{
                ...tileVariant,
                vergeOption: undefined,
                ridgeOptions: [],
                ventilationHoodOptions: [ventilationHood]
              }}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    await waitFor(() =>
      expect(updateFormState).toBeCalledWith({ ventilation: ["none"] }, {})
    );
  });

  it("selects 'none' option for verge tiles", async () => {
    const updateFormState = jest.fn();

    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <FormContext.Provider
            value={{
              updateFormState: updateFormState,
              hasBeenSubmitted: false,
              submitButtonDisabled: false,
              values: {}
            }}
          >
            <TileOptions
              selections={{ verge: "none", ventilationHoods: [] }}
              variant={{
                ...tileVariant,
                vergeOption: verge,
                ridgeOptions: [],
                ventilationHoodOptions: []
              }}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    await waitFor(() =>
      expect(updateFormState).toBeCalledWith({ verge: "none" }, {})
    );
  });
});
