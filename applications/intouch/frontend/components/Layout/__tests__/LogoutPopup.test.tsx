import React from "react";
import { fireEvent, act } from "@testing-library/react";
import LogoutPopup from "../LogoutPopup";
import { renderWithI18NProvider } from "../../../lib/tests/utils";

describe("Logout Popup", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    Object.defineProperty(window, "location", {
      writable: true,
      value: { assign: jest.fn() }
    });
  });
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("Should open the popup if no activity", async () => {
    const screen = renderWithI18NProvider(
      <LogoutPopup showAfter={200} waitFor={200} />
    );
    const popupTitle = screen.queryAllByText("session.dialog.title");
    expect(popupTitle).toHaveLength(0);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    screen.getByText("session.dialog.title");
  });

  it("Should logout if no activity and waiter for user interaction after show the popup", async () => {
    jest.spyOn(window.location, "assign");
    renderWithI18NProvider(<LogoutPopup showAfter={200} waitFor={200} />);

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(window.location.assign).toHaveBeenCalledWith("/api/auth/logout");
  });

  it("Should be able to continue the session if pressed the esxtend session button", async () => {
    jest.spyOn(window.location, "assign");
    const screen = renderWithI18NProvider(
      <LogoutPopup showAfter={200} waitFor={200} />
    );

    act(() => {
      jest.advanceTimersByTime(300);
      fireEvent.click(screen.getByText("session.dialog.continue"));
      jest.advanceTimersByTime(300);
    });

    expect(window.location.assign).not.toHaveBeenCalled();
  });
});
