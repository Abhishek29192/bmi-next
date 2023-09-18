import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved
} from "@testing-library/react";
import LoginAlert from "../LoginAlert";

jest.mock("@bmi/gatsby-theme-auth0", () => ({
  useAuth: () => ({ isLoggedIn: false })
}));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("LoginAlert Component", () => {
  it("renders without errors when not logged in", () => {
    render(<LoginAlert />);
    expect(screen.getByText("MC: logout.label.alert")).toBeInTheDocument();
  });

  it("does not render when already shown", () => {
    localStorage.setItem("isAlreadyShownAlert", "true");

    render(<LoginAlert />);
    expect(
      screen.queryByText("MC: logout.label.alert")
    ).not.toBeInTheDocument();
  });

  it("closes the alert when the close button is clicked", async () => {
    localStorage.setItem("isAlreadyShownAlert", "false");
    render(<LoginAlert />);
    const closeButton = screen.getByTitle("Close");
    fireEvent.click(closeButton);
    expect(
      screen.queryByText("MC: logout.label.alert")
    ).not.toBeInTheDocument();
  });

  it("closes the alert by timer when logged in", async () => {
    localStorage.setItem("isAlreadyShownAlert", "false");
    render(<LoginAlert />);

    expect(screen.getByText("MC: logout.label.alert")).toBeInTheDocument();

    jest.runAllTimers();

    await waitForElementToBeRemoved(() =>
      screen.queryByText("MC: logout.label.alert")
    );
  });
});
