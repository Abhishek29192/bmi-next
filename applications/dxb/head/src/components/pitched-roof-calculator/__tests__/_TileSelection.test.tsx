import { FormContext } from "@bmi-digital/components/form";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import TileSelection, { TileSelectionProps } from "../_TileSelection";
import { AnalyticsContext } from "../helpers/analytics";
import { MicroCopy } from "../helpers/microCopy";
import { GroupedTiles } from "../types";
import en from "./samples/copy/en.json";
import { createTile } from "./helpers/createTile";

const firstTile = createTile({
  baseProduct: {
    name: "12345",
    code: "zanda_minster_main_tile"
  },
  name: "first product",
  brokenBond: false,
  category: "clay",
  packSize: 20
});

const secondTile = createTile({
  baseProduct: {
    name: "2345",
    code: "Nova_main_tile_engobed_black"
  },
  name: "second product",
  brokenBond: false,
  category: "clay",
  packSize: 15
});

const tiles: GroupedTiles = {
  zanda_minster_main_tile: [{ ...firstTile }],
  Nova_main_tile_engobed_black: [{ ...secondTile }]
};

const defaultProps: TileSelectionProps = {
  tiles,
  isRequired: true,
  name: "tile",
  fieldIsRequiredError: "field is required",
  tileMaterial: "Clay"
};

const pushEvent = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe("PitchedRoofCalculator TileSelection component", () => {
  it("calls analytics event", async () => {
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
              <TileSelection {...defaultProps} />
            </AnalyticsContext.Provider>
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    fireEvent.click(
      screen.getByText(tiles.zanda_minster_main_tile[0].baseProduct!.name!)
    );
    await waitFor(() => expect(pushEvent).toHaveBeenCalledTimes(1));
  });

  it("renders with no tiles", () => {
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
            <TileSelection {...defaultProps} tiles={{}} />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(screen.getByText("MC: tileSelection.empty")).toBeInTheDocument();
  });

  it("renders with title for multiple colors", () => {
    const tiles = {
      zanda_minster_main_tile: [
        { ...firstTile },
        {
          ...secondTile,
          baseProduct: {
            name: "12345",
            code: "zanda_minster_main_tile"
          }
        }
      ]
    };

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
            <TileSelection {...defaultProps} tiles={tiles} />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(screen.getByText("2 MC: tileSelection.colors")).toBeInTheDocument();
  });

  it("renders with title for one color", () => {
    const tiles: GroupedTiles = {
      zanda_minster_main_tile: [{ ...firstTile }]
    };

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
            <TileSelection {...defaultProps} tiles={tiles} />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(screen.getByText("1 MC: tileSelection.color")).toBeInTheDocument();
  });

  it("renders with name of variant if base product name does not exist", () => {
    const tiles: GroupedTiles = {
      zanda_minster_main_tile: [
        {
          ...firstTile,
          baseProduct: { name: undefined, code: "zanda_minster_main_tile" }
        }
      ]
    };

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
            <TileSelection {...defaultProps} tiles={tiles} />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(screen.getByText(firstTile.name)).toBeInTheDocument();
  });
});
