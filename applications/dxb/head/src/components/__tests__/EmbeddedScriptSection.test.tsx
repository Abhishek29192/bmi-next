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

    expect(screen.getByTestId("embedded-script")).toHaveAttribute(
      "src",
      "https://fake-script.js"
    );

    expect(screen.getByTestId("embedded-script-section")).toHaveAttribute(
      "id",
      "test-id"
    );
  });

  it("does not render anything when url is absent", () => {
    render(
      <EmbeddedScriptSection
        data={{
          __typename: "ContentfulEmbeddedScriptSection",
          scriptSectionId: "test-id",
          url: ""
        }}
      />
    );

    expect(
      screen.queryByTestId("embedded-script-section")
    ).not.toBeInTheDocument();
  });

  it("does not render anything when id is absent", () => {
    render(
      <EmbeddedScriptSection
        data={{
          __typename: "ContentfulEmbeddedScriptSection",
          scriptSectionId: "test-id",
          url: ""
        }}
      />
    );

    expect(
      screen.queryByTestId("embedded-script-section")
    ).not.toBeInTheDocument();
  });
});
