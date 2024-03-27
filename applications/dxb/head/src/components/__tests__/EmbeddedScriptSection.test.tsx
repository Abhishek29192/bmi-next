import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render, screen } from "@testing-library/react";
import React from "react";
import EmbeddedScriptSection from "../EmbeddedScriptSection";

describe("EmbeddedScriptSection", () => {
  it("renders section title if provided", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "ContentfulEmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake-script.js"
          }}
        />
      </ThemeProvider>
    );

    const sectionTitle = screen.getByRole("heading", {
      name: "Embedded Script"
    });
    expect(sectionTitle).toBeInTheDocument();
    expect(sectionTitle).toHaveClass("Typography-underline");
  });

  it("does not render section title if not provided", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "ContentfulEmbeddedScriptSection",
            title: null,
            scriptSectionId: "test-id",
            url: "https://fake-script.js"
          }}
        />
      </ThemeProvider>
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders embedded script with correct attributes", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "ContentfulEmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake-script.js"
          }}
        />
      </ThemeProvider>
    );

    const scriptElement: HTMLScriptElement =
      screen.getByTestId("embedded-script");
    expect(scriptElement).toHaveAttribute("src", "https://fake-script.js");
    expect(scriptElement).toHaveAttribute("type", "text/javascript");
    expect(scriptElement.async).toBe(true); // toHaveAttribute returns null

    expect(screen.getByTestId("embedded-script-section")).toHaveAttribute(
      "id",
      "test-id"
    );
  });

  it("does not render script when url is absent", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "ContentfulEmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: ""
          }}
        />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("embedded-script")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("embedded-script-section")
    ).not.toBeInTheDocument();
  });

  it("does not render anything when id is absent", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "ContentfulEmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "",
            url: "https://fake-script.js"
          }}
        />
      </ThemeProvider>
    );

    expect(screen.queryByTestId("embedded-script")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("embedded-script-section")
    ).not.toBeInTheDocument();
  });
});
