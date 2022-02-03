import React from "react";
import { render } from "@testing-library/react";
import { FormContext } from "@bmi/form";
import { MicroCopy } from "../helpers/microCopy";
import en from "../samples/copy/en.json";
import data from "../samples/data.json";
import Guttering from "../_Guttering";

describe("PitchedRoofCalculator Guttering component", () => {
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
          <Guttering
            selections={{}}
            gutters={data.gutters as any}
            gutterHooks={data.gutterHooks as any}
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders gutter variants and hooks", () => {
    const updateFormState = jest.fn();
    const hasBeenSubmitted = false;
    const submitButtonDisabled = false;

    const values = {
      guttering: data.gutters[0].name,
      gutteringVariant: data.gutters[0].variants[0].externalProductCode,
      gutteringHook: data.gutterHooks[0].externalProductCode
    };

    const { container } = render(
      <MicroCopy.Provider values={en}>
        <FormContext.Provider
          value={{
            updateFormState,
            hasBeenSubmitted,
            submitButtonDisabled,
            values
          }}
        >
          <Guttering
            selections={values}
            gutters={data.gutters as any}
            gutterHooks={data.gutterHooks as any}
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders with no options", () => {
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
          <Guttering selections={{}} gutters={[]} gutterHooks={[]} />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
