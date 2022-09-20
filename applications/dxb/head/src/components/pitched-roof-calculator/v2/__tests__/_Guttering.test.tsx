import { Form, FormContext } from "@bmi/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import { createProduct } from "../../helpers/products";
import en from "../../samples/copy/en.json";
import { GroupedGutters, GutterHook, GutterVariant } from "../../types/v2";
import Guttering from "../_Guttering";

const gutterVariant = createProduct<GutterVariant>({
  ...createProduct({
    name: "Variant",
    externalProductCode: "variant",
    baseProduct: { name: "base product", code: "base_product_code" }
  }),
  length: 20
});

const gutters: GroupedGutters = {
  base_product_code: [gutterVariant]
};

const gutterHook = createProduct<GutterHook>({
  ...createProduct({ name: "Gutter hook", externalProductCode: "Gutter_hook" }),
  length: 20
});

describe("PitchedRoofCalculator Guttering component", () => {
  it("renders with no options", () => {
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
          <Guttering selections={{}} gutters={{}} gutterHooks={[]} />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(
      screen.queryByText("MC: guttering.gutter.title")
    ).not.toBeInTheDocument();
  });

  it("renders fields step by step", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Form>
          <Guttering gutters={gutters} gutterHooks={[gutterHook]} />
        </Form>
      </MicroCopy.Provider>
    );

    expect(screen.queryByText(gutterVariant.name)).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(gutterVariant.baseProduct.name));
    expect(screen.getByText(gutterVariant.name)).toBeInTheDocument();

    expect(screen.queryByText(gutterHook.name)).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByDisplayValue(gutterVariant.externalProductCode)
    );
    expect(screen.getByText(gutterHook.name)).toBeInTheDocument();
  });

  it("return null for GutteringSelection component", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Form>
          <Guttering gutters={{}} gutterHooks={[]} />
        </Form>
      </MicroCopy.Provider>
    );

    expect(
      screen.queryByText("MC: guttering.gutter.title")
    ).not.toBeInTheDocument();
  });

  it("returns null for GutteringHookSelection component", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Form>
          <Guttering
            gutters={gutters}
            selections={{
              guttering: gutterVariant.baseProduct.code,
              gutteringVariant: gutterVariant
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

  it("renders downPipe and downPipeConnector inputs", () => {
    render(
      <MicroCopy.Provider values={en}>
        <Form>
          <Guttering
            gutters={{
              base_product_code: [
                {
                  ...gutterVariant,
                  baseProduct: { code: "base_product_code", name: undefined },
                  productReferences: [
                    { type: "DOWN_PIPE", code: "down_pipe", name: "Down Pipe" },
                    {
                      type: "DOWN_PIPE_CONNECTOR",
                      code: "down_pipe_connector",
                      name: "Down Pipe Connector"
                    }
                  ]
                }
              ]
            }}
            selections={{
              guttering: gutterVariant.baseProduct.code,
              gutteringVariant: gutterVariant
            }}
            gutterHooks={[]}
          />
        </Form>
      </MicroCopy.Provider>
    );

    expect(
      screen.getByText("MC: guttering.downPipe.title")
    ).toBeInTheDocument();
    expect(
      screen.getByText("MC: guttering.downPipeConnectors.title")
    ).toBeInTheDocument();
  });
});
