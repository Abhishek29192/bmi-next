import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import MobileStickyFooter from "../MobileStickyFooter";
import { classes } from "../MobileStickyFooterStyles";

const mockBoundingClientRect = ({ bottom }: { bottom: number }) => {
  window.HTMLElement.prototype.getBoundingClientRect = () =>
    ({
      bottom
    }) as DOMRect;
};

const originalGetBoundingClientRect =
  window.HTMLElement.prototype.getBoundingClientRect;

afterEach(() => {
  window.HTMLElement.prototype.getBoundingClientRect =
    originalGetBoundingClientRect;
});

describe("MobileStickyFooter component", () => {
  it("renders 'Scroll to available sessions' button correctly", () => {
    render(
      <ThemeProvider>
        <MobileStickyFooter scrollToSessions={jest.fn()} disabled={false} />
      </ThemeProvider>
    );
    expect(
      screen.getByTestId("scroll-to-available-sessions-button")
    ).toHaveTextContent("MC: trainingDetails.see.available.sessions.button");
  });

  it("calls 'scrollToSessions' on 'Scroll to available sessions' button click", () => {
    const scrollToSessionsMock = jest.fn();

    render(
      <ThemeProvider>
        <MobileStickyFooter
          scrollToSessions={scrollToSessionsMock}
          disabled={false}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId("scroll-to-available-sessions-button"));
    expect(scrollToSessionsMock).toHaveBeenCalledTimes(1);
  });

  it("disables 'Scroll to available sessions' button if disabled === true", () => {
    render(
      <ThemeProvider>
        <MobileStickyFooter disabled={true} scrollToSessions={jest.fn()} />
      </ThemeProvider>
    );
    expect(
      screen.getByTestId("scroll-to-available-sessions-button")
    ).toBeDisabled();
  });

  it("should not disable 'Scroll to available sessions' button if disabled === false", () => {
    render(
      <ThemeProvider>
        <MobileStickyFooter disabled={false} scrollToSessions={jest.fn()} />
      </ThemeProvider>
    );
    expect(
      screen.getByTestId("scroll-to-available-sessions-button")
    ).not.toBeDisabled();
  });

  it("should pass 'sticky' class name if footer is stuck to the bottom", () => {
    mockBoundingClientRect({ bottom: window.innerHeight });

    render(
      <ThemeProvider>
        <MobileStickyFooter disabled={false} scrollToSessions={jest.fn()} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mobile-sticky-footer").classList).toContain(
      classes.sticky
    );
  });

  it("should not pass 'sticky' class name if footer is not stuck to the bottom", () => {
    mockBoundingClientRect({ bottom: 0 });

    render(
      <ThemeProvider>
        <MobileStickyFooter disabled={false} scrollToSessions={jest.fn()} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mobile-sticky-footer").classList).not.toContain(
      classes.sticky
    );
  });

  it("should pass 'sticky' class name if footer is stuck to the bottom on scroll", async () => {
    mockBoundingClientRect({ bottom: 0 });

    render(
      <ThemeProvider>
        <MobileStickyFooter disabled={false} scrollToSessions={jest.fn()} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mobile-sticky-footer").classList).not.toContain(
      classes.sticky
    );

    mockBoundingClientRect({ bottom: window.innerHeight });
    window.dispatchEvent(new Event("scroll"));
    await waitFor(() =>
      expect(screen.getByTestId("mobile-sticky-footer").classList).toContain(
        classes.sticky
      )
    );
  });

  it("should not pass 'sticky' class name if footer is not stuck to the bottom on scroll", async () => {
    mockBoundingClientRect({ bottom: window.innerHeight });

    render(
      <ThemeProvider>
        <MobileStickyFooter disabled={false} scrollToSessions={jest.fn()} />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mobile-sticky-footer").classList).toContain(
      classes.sticky
    );

    mockBoundingClientRect({ bottom: 0 });
    window.dispatchEvent(new Event("scroll"));
    await waitFor(() =>
      expect(
        screen.getByTestId("mobile-sticky-footer").classList
      ).not.toContain(classes.sticky)
    );
  });
});
