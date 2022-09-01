import { FormContext } from "@bmi/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import { createProduct } from "../../helpers/products";
import en from "../../samples/copy/en.json";
import { GroupedTiles, Tile } from "../../types/v2";
import TileSelection from "../_TileSelection";

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

describe("PitchedRoofCalculator TileSelection component", () => {
  it("calls select function", () => {
    const select = jest.fn();

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
          <TileSelection select={select} selected={undefined} tiles={tiles} />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    fireEvent.click(
      screen.getByText(tiles.zanda_minster_main_tile[0].baseProduct.name)
    );
    expect(select).toBeCalledWith(
      tiles.zanda_minster_main_tile[0].baseProduct.code
    );
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
          <TileSelection select={jest.fn()} selected={undefined} tiles={{}} />
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
          <TileSelection
            select={jest.fn()}
            selected={undefined}
            tiles={tiles}
          />
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
          <TileSelection
            select={jest.fn()}
            selected={undefined}
            tiles={tiles}
          />
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
          <TileSelection
            select={jest.fn()}
            selected={undefined}
            tiles={tiles}
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(screen.getByText(firstTile.name)).toBeInTheDocument();
  });
});
