import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Form } from "@bmi-digital/components";
import TechnologyInput from "../TechnologyInput";
import I18nProvider from "../../../../lib/tests/fixtures/i18n";

describe("TechnologyInput", () => {
  it("should render correctly", () => {
    const { container } = render(
      <I18nProvider>
        <TechnologyInput />
      </I18nProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should render disabled", () => {
    const { container } = render(
      <I18nProvider>
        <TechnologyInput disabled />
      </I18nProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with a default value", async () => {
    const { container } = render(
      <I18nProvider>
        <Form>
          <TechnologyInput defaultValue="FLAT" />
        </Form>
      </I18nProvider>
    );

    // NOTE: Checked attribute does not change in the snapshots
    expect(
      container.querySelector<HTMLInputElement>("#radio-technology-PITCHED")
        .checked
    ).toBe(false);

    expect(
      container.querySelector<HTMLInputElement>("#radio-technology-FLAT")
        .checked
    ).toBe(true);
  });

  it("should change value when interacted with", async () => {
    const { container } = render(
      <I18nProvider>
        <Form>
          <TechnologyInput defaultValue="FLAT" />
        </Form>
      </I18nProvider>
    );

    const inputPitched = container.querySelector<HTMLInputElement>(
      "#radio-technology-PITCHED"
    );
    const inputFlat = container.querySelector<HTMLInputElement>(
      "#radio-technology-FLAT"
    );

    // NOTE: Checked attribute does not change in the snapshots
    expect(inputPitched.checked).toBe(false);
    expect(inputFlat.checked).toBe(true);

    fireEvent.click(
      container.querySelector<HTMLLabelElement>(
        'label[for="radio-technology-PITCHED"]'
      )
    );

    expect(inputPitched.checked).toBe(true);
    expect(inputFlat.checked).toBe(false);
  });
});
