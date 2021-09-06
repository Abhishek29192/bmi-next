import React from "react";
import {
  renderWithI18NProvider,
  screen,
  within
} from "../../../../lib/tests/utils";
import { WizardAutoComplete, WizardAutoCompleteOptions } from "..";

describe("WizardAutoComplete", () => {
  const autoCompleteOptions: WizardAutoCompleteOptions = {
    totalCount: 12,
    items: [
      {
        id: 1,
        name: "Product1",
        description: "Details1"
      },
      {
        id: 2,
        name: "Product2",
        description: "Details2"
      },
      {
        id: 3,
        name: "Product3",
        description: "Details3"
      },
      {
        id: 4,
        name: "Product4",
        description: "Details4"
      },
      {
        id: 5,
        name: "Product5",
        description: "Details5"
      },
      {
        id: 6,
        name: "Product6",
        description: "Details6"
      },
      {
        id: 7,
        name: "Product7",
        description: "Details7"
      }
    ]
  };

  it("should render correct options", () => {
    renderWithI18NProvider(
      <WizardAutoComplete options={autoCompleteOptions} />
    );
    const autoComplete = screen.queryByTestId("wizard-autocomplete");
    expect(autoComplete).toBeTruthy();

    const dropDown = within(autoComplete).getByRole("button", { name: "Open" });
    dropDown.click();

    expect(screen.getByTestId("option-1")).toBeVisible();
  });
});
