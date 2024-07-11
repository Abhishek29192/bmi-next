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
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake/script.js",
            ecmaScript: false
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
            __typename: "EmbeddedScriptSection",
            title: null,
            scriptSectionId: "test-id",
            url: "https://fake/script.js",
            ecmaScript: false
          }}
        />
      </ThemeProvider>
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders embedded script with correct attributes when not ECMAScript module", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake/script.js",
            ecmaScript: false
          }}
        />
      </ThemeProvider>
    );

    const scriptElement: HTMLScriptElement =
      screen.getByTestId("embedded-script");
    expect(scriptElement).toHaveAttribute("src", "https://fake/script.js");
    expect(scriptElement).not.toHaveAttribute("type");
    expect(scriptElement.async).toBe(true); // toHaveAttribute returns null

    expect(screen.getByTestId("embedded-script-section")).toHaveAttribute(
      "id",
      "test-id"
    );
  });

  it("renders embedded script with correct attributes when ECMAScript module", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake/script.js",
            ecmaScript: true
          }}
        />
      </ThemeProvider>
    );

    const scriptElement: HTMLScriptElement =
      screen.getByTestId("embedded-script");
    expect(scriptElement).toHaveAttribute("src", "https://fake/script.js");
    expect(scriptElement).toHaveAttribute("type", "module");
    expect(scriptElement.async).toBe(true); // toHaveAttribute returns null

    expect(screen.getByTestId("embedded-script-section")).toHaveAttribute(
      "id",
      "test-id"
    );
  });

  it("renders embedded script with correct attributes when file extension is cjs and ECMAScript is true", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake/script.cjs",
            ecmaScript: true
          }}
        />
      </ThemeProvider>
    );

    const scriptElement: HTMLScriptElement =
      screen.getByTestId("embedded-script");
    expect(scriptElement).toHaveAttribute("src", "https://fake/script.cjs");
    expect(scriptElement).not.toHaveAttribute("type");
    expect(scriptElement.async).toBe(true); // toHaveAttribute returns null

    expect(screen.getByTestId("embedded-script-section")).toHaveAttribute(
      "id",
      "test-id"
    );
  });

  it("renders embedded script with correct attributes when file extension is cjs and ECMAScript is false", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake/script.cjs",
            ecmaScript: false
          }}
        />
      </ThemeProvider>
    );

    const scriptElement: HTMLScriptElement =
      screen.getByTestId("embedded-script");
    expect(scriptElement).toHaveAttribute("src", "https://fake/script.cjs");
    expect(scriptElement).not.toHaveAttribute("type");
    expect(scriptElement.async).toBe(true); // toHaveAttribute returns null

    expect(screen.getByTestId("embedded-script-section")).toHaveAttribute(
      "id",
      "test-id"
    );
  });

  it("renders embedded script with correct attributes when file extension is cjs with query parameters and ECMAScript is true", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake/script.cjs?query=1",
            ecmaScript: true
          }}
        />
      </ThemeProvider>
    );

    const scriptElement: HTMLScriptElement =
      screen.getByTestId("embedded-script");
    expect(scriptElement).toHaveAttribute(
      "src",
      "https://fake/script.cjs?query=1"
    );
    expect(scriptElement).not.toHaveAttribute("type");
    expect(scriptElement.async).toBe(true); // toHaveAttribute returns null

    expect(screen.getByTestId("embedded-script-section")).toHaveAttribute(
      "id",
      "test-id"
    );
  });

  it("renders embedded script with correct attributes when file extension is mjs and ECMAScript is false", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake/script.mjs",
            ecmaScript: false
          }}
        />
      </ThemeProvider>
    );

    const scriptElement: HTMLScriptElement =
      screen.getByTestId("embedded-script");
    expect(scriptElement).toHaveAttribute("src", "https://fake/script.mjs");
    expect(scriptElement).toHaveAttribute("type", "module");
    expect(scriptElement.async).toBe(true); // toHaveAttribute returns null

    expect(screen.getByTestId("embedded-script-section")).toHaveAttribute(
      "id",
      "test-id"
    );
  });

  it("renders embedded script with correct attributes when file extension is mjs and ECMAScript is true", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake/script.mjs",
            ecmaScript: true
          }}
        />
      </ThemeProvider>
    );

    const scriptElement: HTMLScriptElement =
      screen.getByTestId("embedded-script");
    expect(scriptElement).toHaveAttribute("src", "https://fake/script.mjs");
    expect(scriptElement).toHaveAttribute("type", "module");
    expect(scriptElement.async).toBe(true); // toHaveAttribute returns null

    expect(screen.getByTestId("embedded-script-section")).toHaveAttribute(
      "id",
      "test-id"
    );
  });

  it("renders embedded script with correct attributes when file extension is mjs with query parameters and ECMAScript is false", () => {
    render(
      <ThemeProvider>
        <EmbeddedScriptSection
          data={{
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "https://fake/script.mjs?query=1",
            ecmaScript: false
          }}
        />
      </ThemeProvider>
    );

    const scriptElement: HTMLScriptElement =
      screen.getByTestId("embedded-script");
    expect(scriptElement).toHaveAttribute(
      "src",
      "https://fake/script.mjs?query=1"
    );
    expect(scriptElement).toHaveAttribute("type", "module");
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
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "test-id",
            url: "",
            ecmaScript: false
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
            __typename: "EmbeddedScriptSection",
            title: "Embedded Script",
            scriptSectionId: "",
            url: "https://fake/script.js",
            ecmaScript: false
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
