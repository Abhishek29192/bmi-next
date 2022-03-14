import { ThemeProvider } from "@bmi/components";
import React from "react";
import { WizardProductDetailCard } from "..";
import { render } from "../../../../lib/tests/utils";

describe("WizardProductDetailCard", () => {
  it("should render", () => {
    const { container } = render(
      <ThemeProvider>
        <WizardProductDetailCard
          name="name"
          description="description"
          brand="brand"
          family="family"
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
