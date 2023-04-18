import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MicroCopy } from "../../helpers/microCopy";
import en from "../../samples/copy/en.json";
import no from "../../samples/copy/no.json";
import PitchedRoofCalculator from "../PitchedRoofCalculator";

const LOADED_TEXT = "loaded";

jest.mock("../_PitchedRoofCalculatorSteps", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <p>{LOADED_TEXT}</p>)
}));

describe("PitchedRoofCalculator component", () => {
  it("renders correctly", async () => {
    const { baseElement } = render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <PitchedRoofCalculator
            isOpen
            onClose={jest.fn()}
            isDebugging
            calculatorConfig={null}
          />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    await screen.findByText(LOADED_TEXT);

    expect(baseElement).toMatchSnapshot();
  });

  it("renders closed", async () => {
    const { baseElement } = render(
      <ThemeProvider>
        <MicroCopy.Provider values={no}>
          <PitchedRoofCalculator
            onClose={jest.fn()}
            isDebugging
            onAnalyticsEvent={jest.fn()}
            calculatorConfig={null}
          />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    await screen.findByText(LOADED_TEXT);

    expect(baseElement).toMatchSnapshot();
  });

  it("calls onClose", async () => {
    const onClose = jest.fn();
    const onAnalyticsEvent = jest.fn();

    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <PitchedRoofCalculator
            isOpen
            onClose={onClose}
            isDebugging
            onAnalyticsEvent={onAnalyticsEvent}
            calculatorConfig={null}
          />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    await screen.findByText(LOADED_TEXT);

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(onClose.mock.calls).toMatchSnapshot();
  });

  it("calls onClose with analytics error", async () => {
    const onClose = jest.fn();
    const onAnalyticsEvent = jest.fn().mockImplementation(() => {
      throw new Error("Can't reach analytics services");
    });

    render(
      <ThemeProvider>
        <MicroCopy.Provider values={en}>
          <PitchedRoofCalculator
            isOpen
            onClose={onClose}
            isDebugging
            onAnalyticsEvent={onAnalyticsEvent}
            calculatorConfig={null}
          />
        </MicroCopy.Provider>
      </ThemeProvider>
    );

    await screen.findByText(LOADED_TEXT);

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect((console.warn as jest.Mock).mock.calls).toMatchSnapshot();
  });
});
