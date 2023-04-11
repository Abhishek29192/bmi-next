import { FormContext, ThemeProvider } from "@bmi-digital/components";
import { createProduct } from "@bmi/elasticsearch-types";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../helpers/microCopy";
import { Underlay } from "../types";
import UnderlaySelection from "../_UnderlaySelection";
import en from "./samples/copy/en.json";

const pushEvent = jest.fn();
jest.mock("../helpers/analytics", () => {
  const actual = jest.requireActual("../helpers/analytics");
  return {
    ...actual,
    useAnalyticsContext: () => pushEvent
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

const underlayWithoutDescription = createProduct({
  name: "First underlay",
  externalProductCode: "11",
  overlap: 0,
  minSupportedPitch: 15,
  length: 30,
  shortDescription: undefined,
  width: 1400
}) as Underlay;

const underlayWithDescription = createProduct({
  name: "Underlay with description",
  externalProductCode: "22",
  shortDescription: "Description",
  overlap: 0,
  minSupportedPitch: 15,
  length: 30,
  width: 1500
}) as Underlay;

describe("PitchedRoofCalculator UnderlaySelection component", () => {
  it("renders with description", () => {
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
            <UnderlaySelection
              selected={undefined}
              options={[underlayWithDescription]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(
      screen.getByText(underlayWithDescription.shortDescription)
    ).toBeInTheDocument();
  });

  it("renders with no options", () => {
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
            <UnderlaySelection options={[]} />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(screen.getByText("MC: underlaySelection.empty")).toBeInTheDocument();
  });

  it("render with selected by default option", () => {
    let selected = undefined;
    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <FormContext.Provider
            value={{
              updateFormState: (fieldValues) => (selected = fieldValues),
              hasBeenSubmitted: false,
              submitButtonDisabled: false,
              values: {}
            }}
          >
            <UnderlaySelection
              selected={underlayWithDescription}
              options={[underlayWithDescription, underlayWithoutDescription]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    expect(selected.underlay).toBe(underlayWithDescription.externalProductCode);
  });

  describe("PitchedRoofCalculator UnderlaySelection - GTM labels", () => {
    it("pushed event with description", () => {
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
              <UnderlaySelection
                selected={undefined}
                options={[underlayWithDescription]}
              />
            </FormContext.Provider>
          </MicroCopy.Provider>
        </ThemeProvider>
      );

      const expectedResult = {
        event: "dxb.button_click",
        action: "selected",
        id: "rc-select-underlay",
        label: `${underlayWithDescription.name} - ${underlayWithDescription.shortDescription} - MC: calculator.nobb.label: ${underlayWithDescription.externalProductCode}`
      };

      fireEvent.click(screen.getByText(underlayWithDescription.name));
      expect(pushEvent).toBeCalledWith(expectedResult);
    });

    it("calls analytics event without description", () => {
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
              <UnderlaySelection
                selected={undefined}
                options={[underlayWithoutDescription]}
              />
            </FormContext.Provider>
          </MicroCopy.Provider>
        </ThemeProvider>
      );

      const expectedResult = {
        event: "dxb.button_click",
        action: "selected",
        id: "rc-select-underlay",
        label: `${underlayWithoutDescription.name} - MC: calculator.nobb.label: ${underlayWithoutDescription.externalProductCode}`
      };

      fireEvent.click(screen.getByText(underlayWithoutDescription.name));
      expect(pushEvent).toBeCalledWith(expectedResult);
    });
  });
});
