import { FormContext } from "@bmi/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import data from "../../samples/data.json";
import UnderlaySelection from "../_UnderlaySelection";

const dimensionsSample = {
  A: "10",
  B: "5",
  P1: "20",
  P2: "21"
};

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

describe("PitchedRoofCalculator UnderlaySelection component", () => {
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
          <UnderlaySelection
            selected={undefined}
            dimensions={dimensionsSample}
            options={data.underlays}
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
          <UnderlaySelection
            selected={undefined}
            dimensions={dimensionsSample}
            options={[]}
          />
        </FormContext.Provider>
      </MicroCopy.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  describe("PitchedRoofCalculator UnderlaySelection - GTM labels", () => {
    it("pushed event with description", () => {
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
            <UnderlaySelection
              selected={undefined}
              dimensions={dimensionsSample}
              options={[data.underlays[0]]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      );

      const expectedResult = {
        event: "dxb.button_click",
        action: "selected",
        id: "rc-select-underlay",
        label: `${data.underlays[0].name} - ${data.underlays[0].description} - MC: calculator.nobb.label: ${data.underlays[0].externalProductCode}`
      };

      fireEvent.click(screen.getByText(data.underlays[0].name));
      expect(pushEvent).toBeCalledWith(expectedResult);
    });

    it("renders without description", () => {
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
            <UnderlaySelection
              selected={undefined}
              dimensions={dimensionsSample}
              options={[{ ...data.underlays[0], description: undefined }]}
            />
          </FormContext.Provider>
        </MicroCopy.Provider>
      );

      const expectedResult = {
        event: "dxb.button_click",
        action: "selected",
        id: "rc-select-underlay",
        label: `${data.underlays[0].name} - MC: calculator.nobb.label: ${data.underlays[0].externalProductCode}`
      };

      fireEvent.click(screen.getByText(data.underlays[0].name));
      expect(pushEvent).toBeCalledWith(expectedResult);
    });
  });
});
