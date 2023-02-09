import { ThemeProvider } from "@bmi-digital/components";
import { render } from "@testing-library/react";
import React from "react";
import { IntegratedLinkCard } from "../components";

describe("IntegratedLinkCard component", () => {
  it("should renders correctly", () => {
    const { getByText } = render(
      <ThemeProvider>
        <IntegratedLinkCard isOpen={true} title={"test title"}>
          <p>Test paragraph</p>
        </IntegratedLinkCard>
      </ThemeProvider>
    );
    expect(getByText("test title")).toBeInTheDocument();
  });
});
