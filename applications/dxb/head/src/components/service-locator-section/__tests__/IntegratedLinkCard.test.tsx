import { ThemeProvider } from "@bmi-digital/components";
import { render, screen } from "@testing-library/react";
import React from "react";
import { IntegratedLinkCard } from "../components";

describe("IntegratedLinkCard component", () => {
  it("should renders correctly", () => {
    render(
      <ThemeProvider>
        <IntegratedLinkCard isOpen={true} title={"test title"}>
          <p>Test paragraph</p>
        </IntegratedLinkCard>
      </ThemeProvider>
    );
    expect(screen.getByText("test title")).toBeInTheDocument();
  });
});
