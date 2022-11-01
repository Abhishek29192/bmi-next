import { Form, ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import I18nProvider from "../../../../lib/tests/fixtures/i18n";
import TechnologyInput from "../TechnologyInput";

describe("TechnologyInput", () => {
  it("should render correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <TechnologyInput />
        </I18nProvider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should render disabled", () => {
    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <TechnologyInput disabled />
        </I18nProvider>
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should render with a default value", async () => {
    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <Form>
            <TechnologyInput defaultValue="FLAT" />
          </Form>
        </I18nProvider>
      </ThemeProvider>
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
      <ThemeProvider>
        <I18nProvider>
          <Form>
            <TechnologyInput defaultValue="FLAT" />
          </Form>
        </I18nProvider>
      </ThemeProvider>
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
