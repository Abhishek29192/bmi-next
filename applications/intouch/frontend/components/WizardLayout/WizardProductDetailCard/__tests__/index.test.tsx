import React from "react";
import { render } from "../../../../lib/tests/utils";
import { WizardProductDetailCard } from "..";

describe("WizardProductDetailCard", () => {
  it("should render", () => {
    const { container } = render(
      <WizardProductDetailCard
        name="name"
        description="description"
        brand="brand"
        family="family"
      />
    );

    expect(container).toMatchSnapshot();
  });
});
