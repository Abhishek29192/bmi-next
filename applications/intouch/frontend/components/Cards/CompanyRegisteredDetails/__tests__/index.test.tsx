import React from "react";
import { mockCompany } from "../../../../fixtures/company";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
import { formatCompanyOperations, CompanyRegisteredDetails } from "..";

const suffix = "operations";

describe("formatCompanyOperations", () => {
  it("should add suffix", () => {
    expect(formatCompanyOperations(["flat", "pitched"], suffix)).toMatch(
      / operations$/
    );
  });

  it("should handle single operation", () => {
    expect(formatCompanyOperations(["flat"], suffix)).toMatch(
      /^flat operations$/i
    );
  });

  it("should handle 2 operations", () => {
    expect(formatCompanyOperations(["flat", "pitched"], suffix)).toMatch(
      /^flat and pitched operations$/i
    );
  });

  it("should handle > 2 operations", () => {
    expect(
      formatCompanyOperations(["flat", "pitched", "solar"], suffix)
    ).toMatch(/^flat, pitched and solar operations$/i);
  });
});

describe("CompanyRegisteredDetails", () => {
  beforeEach(() => {
    renderWithI18NProvider(<CompanyRegisteredDetails company={mockCompany} />);
  });

  it("renders company name", () => {
    expect(screen.getByText("Integrated Solutions Inc")).toBeInTheDocument();
  });

  it("renders company referenceNumber", () => {
    expect(screen.getByText("0093-7392")).toBeInTheDocument();
  });

  it("renders registeredAddress lines", () => {
    expect(screen.getByTestId("address")).toBeInTheDocument();
    expect(
      screen.getByText(mockCompany.registeredAddress.firstLine)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockCompany.registeredAddress.town)
    ).toBeInTheDocument();
  });

  it("renders taxNumber", () => {
    expect(screen.getByText("63323-463")).toBeInTheDocument();
  });

  it("renders company tier", () => {
    expect(screen.getByText("T2")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = renderWithI18NProvider(
      <CompanyRegisteredDetails company={mockCompany} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
