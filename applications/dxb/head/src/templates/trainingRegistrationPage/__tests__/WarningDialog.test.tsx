import ThemeProvider from "@bmi-digital/components/theme-provider";
import { globalHistory } from "@reach/router";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import WarningDialog from "../components/WarningDialog";

jest.mock("@reach/router", () => ({
  globalHistory: { navigate: jest.fn() }
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe("WarningDialog component", () => {
  it("should open the dialog by default", () => {
    render(
      <ThemeProvider>
        <WarningDialog blockedUrl="" closeDialog={jest.fn()} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("warning-dialog")).toBeInTheDocument();
  });

  it("should close the dialog on 'Cancel' button click", () => {
    const closeDialog = jest.fn();
    render(
      <ThemeProvider>
        <WarningDialog blockedUrl="" closeDialog={closeDialog} />
      </ThemeProvider>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "MC: training.registration.warning.popup.cancel.btn"
      })
    );
    expect(closeDialog).toHaveBeenCalledTimes(1);
  });

  it("should close the dialog on the cross button click", () => {
    const closeDialog = jest.fn();
    render(
      <ThemeProvider>
        <WarningDialog blockedUrl="" closeDialog={closeDialog} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("CloseIcon"));
    expect(closeDialog).toHaveBeenCalledTimes(1);
  });

  it("should navigate to the blocked page on 'Close' button click", () => {
    const blockedUrl = "/blocked-url";
    render(
      <ThemeProvider>
        <WarningDialog blockedUrl={blockedUrl} closeDialog={jest.fn()} />
      </ThemeProvider>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "MC: training.registration.warning.popup.close.btn"
      })
    );
    expect(globalHistory.navigate).toHaveBeenCalledWith(blockedUrl);
  });

  it("uses correct microcopy for the title", () => {
    render(
      <ThemeProvider>
        <WarningDialog blockedUrl="" closeDialog={jest.fn()} />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("heading", {
        level: 4
      })
    ).toHaveTextContent("MC: training.registration.warning.popup.title");
  });

  it("uses correct microcopy for the description", () => {
    render(
      <ThemeProvider>
        <WarningDialog blockedUrl="" closeDialog={jest.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("warning-dialog-description")).toHaveTextContent(
      "MC: training.registration.warning.popup.description"
    );
  });

  it("uses correct microcopy for 'Leave the page' button", () => {
    render(
      <ThemeProvider>
        <WarningDialog blockedUrl="" closeDialog={jest.fn()} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("dialog-action-button-cancel")).toHaveTextContent(
      "training.registration.warning.popup.cancel.btn"
    );
  });

  it("uses correct microcopy for 'Stay on the page' button", () => {
    render(
      <ThemeProvider>
        <WarningDialog blockedUrl="" closeDialog={jest.fn()} />
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("dialog-action-button-confirm")
    ).toHaveTextContent("training.registration.warning.popup.close.btn");
  });
});
