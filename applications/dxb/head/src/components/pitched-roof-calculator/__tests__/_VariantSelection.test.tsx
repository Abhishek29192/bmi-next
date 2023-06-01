import { FormContext, ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { AnalyticsContext } from "../helpers/analytics";
import { MicroCopy } from "../helpers/microCopy";
import { createProduct } from "../helpers/products";
import { Tile } from "../types";
import VariantSelection from "../_VariantSelection";
import en from "./samples/copy/en.json";

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

afterEach(() => {
  jest.clearAllMocks();
});

describe("PitchedRoofCalculator VariantSelection component", () => {
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
              <VariantSelection options={tiles} />
            </AnalyticsContext.Provider>
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText(tiles[0].color));
    await waitFor(() => expect(pushEvent).toBeCalledTimes(1));
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
