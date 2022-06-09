import { Form, FormContext } from "@bmi/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import data from "../../samples/data.json";
import { Guttering as IGuttering } from "../../types";
import Guttering from "../_Guttering";

describe("PitchedRoofCalculator Guttering component", () => {
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

  it("renders fields step by step", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Form>
          <Guttering
            gutters={data.gutters as IGuttering[]}
            gutterHooks={data.gutterHooks}
          />
        </Form>
      </MicroCopy.Provider>
    );

    const gutterVariant = data.gutters[0].variants[0].name;
    expect(screen.queryByText(gutterVariant)).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(data.gutters[0].name));
    expect(screen.getByText(gutterVariant)).toBeInTheDocument();

    const gutterHook = data.gutterHooks[0].name;
    expect(screen.queryByText(gutterHook)).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByDisplayValue(data.gutters[0].variants[0].externalProductCode)
    );
    expect(screen.getByText(gutterHook)).toBeInTheDocument();
  });

  it("return null for GutteringSelection component", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Form>
          <Guttering gutters={[]} gutterHooks={[]} />
        </Form>
      </MicroCopy.Provider>
    );

    expect(
      screen.queryByText("MC: guttering.gutter.title")
    ).not.toBeInTheDocument();
  });

  it("returns null for GutteringVariantSelection component", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Form>
          <Guttering
            gutters={[{ ...data.gutters[0], variants: [] }]}
            selections={{ guttering: data.gutters[0].name }}
            gutterHooks={[]}
          />
        </Form>
      </MicroCopy.Provider>
    );

    expect(
      screen.queryByText("MC: guttering.gutterVariant.title")
    ).not.toBeInTheDocument();
  });

  it("returns null for GutteringHookSelection component", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Form>
          <Guttering
            gutters={data.gutters as IGuttering[]}
            selections={{
              guttering: data.gutters[0].name,
              gutteringVariant: data.gutters[0].variants[0].externalProductCode
            }}
            gutterHooks={[]}
          />
        </Form>
      </MicroCopy.Provider>
    );

    expect(
      screen.queryByText("MC: guttering.gutterHook.title")
    ).not.toBeInTheDocument();
  });
});
