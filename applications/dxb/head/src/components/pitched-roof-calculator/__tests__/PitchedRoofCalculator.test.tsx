import React from "react";
import { fireEvent, render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import { MicroCopy } from "../helpers/microCopy";
import PitchedRoofCalculator from "../PitchedRoofCalculator";
import en from "../samples/copy/en.json";
import no from "../samples/copy/no.json";
import data from "../samples/data.json";

const LOADED_TEXT = "loaded";

jest.mock("../_PitchedRoofCalculatorSteps", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <p>{LOADED_TEXT}</p>)
}));

beforeEach(() => {
  mockConsole();
});

describe("PitchedRoofCalculator component", () => {
  it("renders correctly", async () => {
    expect(data).toBeTruthy();

    const { container, findByText } = render(
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculator
          isOpen
          onClose={jest.fn()}
          isDebugging
          onAnalyticsEvent={jest.fn()}
          sendEmailAddress={jest.fn()}
          data={data as any}
        />
      </MicroCopy.Provider>
    );

    await findByText(LOADED_TEXT);

    expect(container.parentElement).toMatchSnapshot();
  });

  it("renders closed", async () => {
    const { container, findByText } = render(
      <MicroCopy.Provider values={no}>
        <PitchedRoofCalculator
          onClose={jest.fn()}
          isDebugging
          onAnalyticsEvent={jest.fn()}
          sendEmailAddress={jest.fn()}
          data={data as any}
        />
      </MicroCopy.Provider>
    );

    await findByText(LOADED_TEXT);

    expect(container.parentElement).toMatchSnapshot();
  });

  it("calls onClose", async () => {
    const onClose = jest.fn();
    const onAnalyticsEvent = jest.fn();

    const { getByLabelText, findByText } = render(
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculator
          isOpen
          onClose={onClose}
          isDebugging
          onAnalyticsEvent={onAnalyticsEvent}
          sendEmailAddress={jest.fn()}
          data={data as any}
        />
      </MicroCopy.Provider>
    );

    await findByText(LOADED_TEXT);

    const closeButton = getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(onClose.mock.calls).toMatchSnapshot();
  });

  it("calls onClose with analytics error", async () => {
    const onClose = jest.fn();
    const onAnalyticsEvent = jest.fn().mockImplementation(() => {
      throw new Error("Can't reach analytics services");
    });

    const { getByLabelText, findByText } = render(
      <MicroCopy.Provider values={en}>
        <PitchedRoofCalculator
          isOpen
          onClose={onClose}
          isDebugging
          onAnalyticsEvent={onAnalyticsEvent}
          sendEmailAddress={jest.fn()}
          data={data as any}
        />
      </MicroCopy.Provider>
    );

    await findByText(LOADED_TEXT);

    const closeButton = getByLabelText("Close");
    fireEvent.click(closeButton);

    expect((console.warn as jest.Mock).mock.calls).toMatchSnapshot();
  });
});
