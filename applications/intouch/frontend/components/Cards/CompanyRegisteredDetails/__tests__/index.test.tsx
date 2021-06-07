import React from "react";
import { render } from "@testing-library/react";
import { CompanyRegisteredDetails } from "..";

describe("CompanyRegisteredDetails component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <CompanyRegisteredDetails
        registeredName="Registered Name"
        registeredAddress="Registered Address"
        companyVatNumber="0123456789"
        contract="Valid until 99/99/99"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
