import React from "react";
import { Operation } from "@bmi/intouch-api-types";
import { mockCompany } from "../../../../../fixtures/company";
import { render, screen } from "../../../../../lib/tests/utils";
import ApolloProvider from "../../../../../lib/tests/fixtures/apollo";
import AccountContextWrapper from "../../../../../lib/tests/fixtures/account";
import MarketContextWrapper from "../../../../../lib/tests/fixtures/market";
import I18nProvider from "../../../../../lib/tests/fixtures/i18n";
import { OPERATION_TYPES } from "../../../../../lib/constants";
import { formatCompanyOperations, CompanyRegisteredDetails } from "..";
import { generateTierBenefitItem } from "../../../../../lib/tests/factories/contentful/tierBenefitCollection";

const useGetTierBenefitQuerySpy = jest.fn();
jest.mock("../../../../../graphql/generated/hooks", () => {
  const original = jest.requireActual("../../../../../graphql/generated/hooks");
  return {
    ...original,
    useGetTierBenefitQuery: () => ({
      data: useGetTierBenefitQuerySpy()
    })
  };
});
const t = jest.fn().mockImplementation((key) => {
  return key.replace(/.+\./, "").toLowerCase();
});

describe("formatCompanyOperations", () => {
  it("should add suffix", () => {
    expect(
      formatCompanyOperations(t, [
        OPERATION_TYPES.FLAT,
        OPERATION_TYPES.PITCHED
      ] as Operation[])
    ).toMatchInlineSnapshot(
      `"Flat and pitched company-page:companyoperationssuffix"`
    );
  });

  it("should handle single operation", () => {
    expect(
      formatCompanyOperations(t, [OPERATION_TYPES.FLAT] as Operation[])
    ).toMatchInlineSnapshot(`"Flat company-page:companyoperationssuffix"`);
  });

  it("should handle 2 operations", () => {
    expect(
      formatCompanyOperations(t, [
        OPERATION_TYPES.FLAT,
        OPERATION_TYPES.PITCHED
      ] as Operation[])
    ).toMatchInlineSnapshot(
      `"Flat and pitched company-page:companyoperationssuffix"`
    );
  });

  it("should handle > 2 operations", () => {
    expect(
      formatCompanyOperations(t, [
        OPERATION_TYPES.FLAT,
        OPERATION_TYPES.PITCHED,
        OPERATION_TYPES.SOLAR
      ] as Operation[])
    ).toMatchInlineSnapshot(
      `"Flat, pitched and solar company-page:companyoperationssuffix"`
    );
  });

  it("should handle < 0 operations", () => {
    expect(formatCompanyOperations(t, [] as Operation[])).toMatchInlineSnapshot(
      `""`
    );
  });
});

describe("CompanyRegisteredDetails", () => {
  beforeEach(() => {
    useGetTierBenefitQuerySpy.mockImplementation(() => ({
      tierBenefitCollection: {
        items: [
          generateTierBenefitItem({ tier: "T1" }),
          generateTierBenefitItem({ name: "tier benefit T2", tier: "T2" })
        ]
      }
    }));
  });

  describe("render normally", () => {
    beforeEach(() => {
      render(
        <ApolloProvider>
          <I18nProvider>
            <MarketContextWrapper>
              <AccountContextWrapper>
                <CompanyRegisteredDetails company={mockCompany} />
              </AccountContextWrapper>
            </MarketContextWrapper>
          </I18nProvider>
        </ApolloProvider>
      );
    });
    it("renders company name", () => {
      expect(screen.getByText("Integrated Solutions Inc")).toBeInTheDocument();
    });

    it("renders company referenceNumber", () => {
      expect(screen.getByText("937392")).toBeInTheDocument();
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
      expect(screen.getByText("tier benefit T2")).toBeInTheDocument();
    });

    it("renders operation", () => {
      expect(screen.getByText("companyOperations")).toBeInTheDocument();
    });
  });

  it("matches snapshot", () => {
    const { container } = render(
      <ApolloProvider>
        <I18nProvider>
          <MarketContextWrapper>
            <AccountContextWrapper>
              <CompanyRegisteredDetails company={mockCompany} />
            </AccountContextWrapper>
          </MarketContextWrapper>
        </I18nProvider>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });

  describe("show not render field when no data found", () => {
    useGetTierBenefitQuerySpy.mockImplementation(() => null);
    render(
      <ApolloProvider>
        <I18nProvider>
          <MarketContextWrapper>
            <AccountContextWrapper>
              <CompanyRegisteredDetails
                company={{
                  ...mockCompany,
                  referenceNumber: null,
                  registeredAddress: null,
                  taxNumber: null,
                  companyOperationsByCompany: {
                    nodes: []
                  }
                }}
              />
            </AccountContextWrapper>
          </MarketContextWrapper>
        </I18nProvider>
      </ApolloProvider>
    );

    it("no referenceNumber", () => {
      expect(screen.queryByText("details.referenceNumber")).toBeFalsy();
    });

    it("no registeredAddress", () => {
      expect(screen.queryByText("details.registeredAddress")).toBeFalsy();
    });

    it("no taxNumber", () => {
      expect(screen.queryByText("details.taxNumber")).toBeFalsy();
    });

    it("no tier", () => {
      expect(screen.queryByText("Tier")).toBeFalsy();
    });

    it("no operations", () => {
      expect(screen.queryByText("companyOperations")).toBeFalsy();
    });
  });
});
