import React from "react";
import { render } from "@testing-library/react";
import I18nextProvider from "../../../../lib/tests/fixtures/i18n";
import { CompanyRegisteredDetails } from "..";

describe("CompanyRegisteredDetails component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <I18nextProvider>
        <CompanyRegisteredDetails
          registeredName="Registered Name"
          registeredAddress="Registered Address"
          companyVatNumber="0123456789"
          contract="Valid until 99/99/99"
        />
      </I18nextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
