import React from "react";
import { render } from "../../../lib/tests/utils";
import WizardContextWrapper, { useWizardContext } from "../WizardContext";

const WizardContextComponent = () => {
  const { activeStep, previousStep, header } = useWizardContext();
  return (
    <div>
      <div data-testid="active-step-id">Active step: {activeStep}</div>
      <div data-testid="previous-step-id">Previous step: {previousStep}</div>
      <div data-testid="header-id">Header: {header.title}</div>
    </div>
  );
};
let wrapper;

describe("WizardContextWrapper", () => {
  beforeEach(() => {
    wrapper = render(
      <WizardContextWrapper project={null}>
        <WizardContextComponent />
      </WizardContextWrapper>
    );
  });
  it("shows active step", () => {
    expect(wrapper.getByTestId("active-step-id")).toHaveTextContent(
      "Active step: 0"
    );
  });
  it("shows previous step", () => {
    expect(wrapper.getByTestId("previous-step-id")).toHaveTextContent(
      "Previous step: 0"
    );
  });
  it("shows header", () => {
    expect(wrapper.getByTestId("header-id")).toHaveTextContent(
      "Header: guarantee_tab.apply_guarantee.wizard.step1.title"
    );
  });
});
