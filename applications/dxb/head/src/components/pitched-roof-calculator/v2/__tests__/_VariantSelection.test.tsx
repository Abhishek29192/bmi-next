import { FormContext, ThemeProvider } from "@bmi/components";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("PitchedRoofCalculator VariantSelection component", () => {
  it("calls analytics event", () => {
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
            <VariantSelection options={tiles} />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText(tiles[0].color));
    waitFor(() => expect(pushEvent).toBeCalledTimes(1));
  });

  it("renders with no variants", () => {
    const { container } = render(
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
            <VariantSelection selected={undefined} options={[]} />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container.childNodes.length).toBe(0);
  });
});
