import { FormContext } from "@bmi/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import Protrusions from "../_Protrusions";

describe("PitchedRoofCalculator Protrusions component", () => {
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
          <Protrusions />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("adds a protrusion", () => {
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
          <Protrusions
            defaultValue={[{ type: "protrusion01", A: 3, B: 3, P: 30 }]}
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
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
