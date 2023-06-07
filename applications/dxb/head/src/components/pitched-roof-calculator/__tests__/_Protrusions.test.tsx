import { FormContext, ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../helpers/microCopy";
import Protrusions from "../_Protrusions";
import en from "./samples/copy/en.json";

describe("PitchedRoofCalculator Protrusions component", () => {
  it("renders correctly", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

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
            <Protrusions />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("adds a protrusion", () => {
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
            <Protrusions
              defaultValue={[{ type: "protrusion01", A: 3, B: 3, P: 30 }]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    const addProtrusionButton = screen.getByText(
      "MC: roofDimensions.protrusions.addAnother"
    );
    fireEvent.click(addProtrusionButton);
    expect(
      screen.getAllByText("MC: roofDimensions.protrusions.remove").length
    ).toBe(2);
  });

  it("renders without 'Add another button' if there are more then 8 protrusions", () => {
    const protrusion = { type: "protrusion01", A: 3, B: 3, P: 30 };

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
            <Protrusions
              defaultValue={[
                protrusion,
                protrusion,
                protrusion,
                protrusion,
                protrusion,
                protrusion,
                protrusion,
                protrusion,
                protrusion
              ]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(
      screen.queryByText("MC: roofDimensions.protrusions.addAnother")
    ).not.toBeInTheDocument();
  });

  it("removes all protrusions", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    render(
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
            <Protrusions
              defaultValue={[
                {},
                { type: "protrusion01", A: "33", B: "55", P: "44" }
              ]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    const removeProtrusionButtons = screen.getAllByText(
      "MC: roofDimensions.protrusions.remove"
    );
    removeProtrusionButtons.forEach((button) => {
      fireEvent.click(button);
    });

    expect(
      screen.queryByText("MC: roofDimensions.protrusions.remove")
    ).not.toBeInTheDocument();
  });
});
