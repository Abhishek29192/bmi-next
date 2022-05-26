import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { FormContext } from "@bmi/components";
import { MicroCopy, getMicroCopy } from "../../helpers/microCopy";
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
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    const { getByText } = render(
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

    const addProtrusionButton = getByText(
      getMicroCopy(en, "roofDimensions.protrusions.add")
    );
    fireEvent.click(addProtrusionButton);

    expect(updateFormState.mock.calls).toMatchSnapshot();
  });

  it("removes a protrusion", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    const { getByText } = render(
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
            defaultValue={[{ type: "protrusion01", A: "33", B: "55", P: "44" }]}
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    const removeProtrusionButton = getByText(
      getMicroCopy(en, "roofDimensions.protrusions.remove")
    );
    fireEvent.click(removeProtrusionButton);

    expect(updateFormState.mock.calls).toMatchSnapshot();
  });
});
