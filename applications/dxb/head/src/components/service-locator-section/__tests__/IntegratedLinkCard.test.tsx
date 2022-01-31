import { render } from "@testing-library/react";
import React from "react";
import { IntegratedLinkCard } from "../components";
import "@testing-library/jest-dom";

describe("IntegratedLinkCard component", () => {
  it("should renders correctly", () => {
    const { getByText } = render(
      <IntegratedLinkCard isOpen={true} title={"test title"}>
        <p>Test paragraph</p>
      </IntegratedLinkCard>
    );
    expect(getByText("test title")).toBeInTheDocument();
  });
});
