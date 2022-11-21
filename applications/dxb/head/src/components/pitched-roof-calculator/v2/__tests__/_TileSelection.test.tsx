import { FormContext } from "@bmi/components";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import { createProduct } from "../../helpers/products";
import en from "../../samples/copy/en.json";
import { GroupedTiles, Tile } from "../../types/v2";
import TileSelection, { TileSelectionProps } from "../_TileSelection";

const firstTile = createProduct<Tile>({
  baseProduct: {
    name: "12345",
    code: "zanda_minster_main_tile"
  },
  name: "first product",
  brokenBond: false,
  category: "clay",
  packSize: 20
});

const secondTile = createProduct<Tile>({
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
  fieldIsRequiredError: "field is required"
};

const pushEvent = jest.fn();
jest.mock("../../helpers/analytics", () => {
  const actual = jest.requireActual("../../helpers/analytics");
  return {
    ...actual,
    useAnalyticsContext: () => pushEvent
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("PitchedRoofCalculator TileSelection component", () => {
  it("calls analytics event", () => {
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
          <TileSelection {...defaultProps} />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    fireEvent.click(
      screen.getByText(tiles.zanda_minster_main_tile[0].baseProduct.name)
    );
    waitFor(() => expect(pushEvent).toBeCalledTimes(1));
  });

  it("renders with no tiles", () => {
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
          <TileSelection {...defaultProps} tiles={{}} />
        </FormContext.Provider>
      </MicroCopy.Provider>
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
    );

    expect(screen.getByText("2 MC: tileSelection.colors")).toBeInTheDocument();
  });

  it("renders with title for one color", () => {
    const tiles: GroupedTiles = {
      zanda_minster_main_tile: [{ ...firstTile }]
    };

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
          <TileSelection {...defaultProps} tiles={tiles} />
        </FormContext.Provider>
      </MicroCopy.Provider>
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
    );

    expect(screen.getByText(firstTile.name)).toBeInTheDocument();
  });
});
