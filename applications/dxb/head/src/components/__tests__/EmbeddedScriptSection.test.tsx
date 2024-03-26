import { render, screen } from "@testing-library/react";
import React from "react";
import EmbeddedScriptSection from "../EmbeddedScriptSection";

describe("EmbeddedScriptSection", () => {
  it("renders embedded script with correct attributes", () => {
    render(
      <EmbeddedScriptSection
        data={{
          __typename: "ContentfulEmbeddedScriptSection",
          scriptSectionId: "test-id",
          url: "https://fake-script.js"
        }}
      />
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
      <EmbeddedScriptSection
        data={{
          __typename: "ContentfulEmbeddedScriptSection",
          scriptSectionId: "test-id",
          url: ""
        }}
      />
    );

    expect(screen.queryByTestId("embedded-script")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("embedded-script-section")
    ).not.toBeInTheDocument();
  });

  it("does not render anything when id is absent", () => {
    render(
      <EmbeddedScriptSection
        data={{
          __typename: "ContentfulEmbeddedScriptSection",
          scriptSectionId: "",
          url: "https://fake-script.js"
        }}
      />
    );

    expect(screen.queryByTestId("embedded-script")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("embedded-script-section")
    ).not.toBeInTheDocument();
  });
});
