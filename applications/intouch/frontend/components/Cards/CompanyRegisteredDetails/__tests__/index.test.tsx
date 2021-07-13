import React from "react";
import { render } from "@testing-library/react";
import I18nextProvider from "../../../../lib/tests/fixtures/i18n";
import { CompanyRegisteredDetails } from "..";
import { mockCompany } from "../../../../fixtures/company";

describe("CompanyRegisteredDetails component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <I18nextProvider>
        <CompanyRegisteredDetails company={mockCompany} />
      </I18nextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
