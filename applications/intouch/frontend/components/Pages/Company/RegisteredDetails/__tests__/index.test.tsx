import React from "react";
import { Operation } from "@bmi/intouch-api-types";
import { mockCompany } from "../../../../../fixtures/company";
import { renderWithI18NProvider, screen } from "../../../../../lib/tests/utils";
import { OPERATION_TYPES } from "../../../../../lib/constants";
import { formatCompanyOperations, CompanyRegisteredDetails } from "..";

const t = jest.fn().mockImplementation((key) => {
  // "Company-page:operation_types.FLAT" --> "flat"
  return key.replace(/.+\./, "").toLowerCase();
});

describe("formatCompanyOperations", () => {
  it("should add suffix", () => {
    expect(
      formatCompanyOperations(t, [
        OPERATION_TYPES.FLAT,
        OPERATION_TYPES.PITCHED
      ] as Operation[])
    ).toMatchInlineSnapshot(`"Flat and pitched operations_suffix"`);
  });

  it("should handle single operation", () => {
    expect(
      formatCompanyOperations(t, [OPERATION_TYPES.FLAT] as Operation[])
    ).toMatchInlineSnapshot(`"Flat operations_suffix"`);
  });

  it("should handle 2 operations", () => {
    expect(
      formatCompanyOperations(t, [
        OPERATION_TYPES.FLAT,
        OPERATION_TYPES.PITCHED
      ] as Operation[])
    ).toMatchInlineSnapshot(`"Flat and pitched operations_suffix"`);
  });

  it("should handle > 2 operations", () => {
    expect(
      formatCompanyOperations(t, [
        OPERATION_TYPES.FLAT,
        OPERATION_TYPES.PITCHED,
        OPERATION_TYPES.SOLAR
      ] as Operation[])
    ).toMatchInlineSnapshot(`"Flat, pitched and solar operations_suffix"`);
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
