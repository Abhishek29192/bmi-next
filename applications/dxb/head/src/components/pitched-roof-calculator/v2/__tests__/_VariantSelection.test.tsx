import { FormContext } from "@bmi/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import { createProduct } from "../../helpers/products";
import en from "../../samples/copy/en.json";
import { Tile } from "../../types/v2";
import VariantSelection from "../_VariantSelection";

const tiles: Tile[] = [
  {
    ...createProduct<Tile>({ name: "first product" }),
    brokenBond: false,
    color: "Red color",
    packSize: 15
  },
  {
    ...createProduct<Tile>({ name: "second product" }),
    brokenBond: false,
    color: "Black color",
    packSize: 20
  }
];

describe("PitchedRoofCalculator VariantSelection component", () => {
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
          <VariantSelection select={select} options={tiles} />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    fireEvent.click(screen.getByText(tiles[0].color));
    expect(select).toBeCalledWith(tiles[0]);
  });

  it("renders with no variants", () => {
    const select = jest.fn();

    const { container } = render(
      <MicroCopy.Provider values={en}>
        <FormContext.Provider
          value={{
            updateFormState: jest.fn(),
            hasBeenSubmitted: false,
            submitButtonDisabled: false,
            values: {}
          }}
        >
          <VariantSelection select={select} selected={undefined} options={[]} />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(container.childNodes.length).toBe(0);
  });
});
