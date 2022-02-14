import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { CompaniesSidePanel } from "..";
import { render } from "../../../../../lib/tests/utils";
import I18nProvider from "../../../../../lib/tests/fixtures/i18n";
import AccountContextWrapper from "../../../../../lib/tests/fixtures/account";
import { GetCompaniesByMarketQuery } from "../../../../../graphql/generated/operations";

describe("CompaniesSidePanel component", () => {
  const emptyNodes = {
    nodes: []
  };
  const companies: GetCompaniesByMarketQuery["companies"]["nodes"] = [
    {
      __typename: "Company",
      id: 1,
      name: "A company",
      certifications: [],
      companyDocuments: emptyNodes,
      companyMembers: emptyNodes,
      companyOperationsByCompany: emptyNodes,
      isProfileComplete: true,
      referenceNumber: 10001,
      tier: "T1",
      updatedAt: "2022-12-12"
    },
    {
      __typename: "Company",
      id: 2,
      name: "Z company",
      certifications: [],
      companyDocuments: emptyNodes,
      companyMembers: emptyNodes,
      companyOperationsByCompany: emptyNodes,
      isProfileComplete: true,
      referenceNumber: 10001,
      tier: "T1",
      updatedAt: "2021-12-12"
    }
  ];
  it("renders correctly", () => {
    const { container } = render(
      <I18nProvider>
        <AccountContextWrapper>
          <CompaniesSidePanel companies={companies} />
        </AccountContextWrapper>
      </I18nProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("check order onclick behavior", async () => {
    const { container } = render(
      <I18nProvider>
        <AccountContextWrapper>
          <CompaniesSidePanel companies={companies} />
        </AccountContextWrapper>
      </I18nProvider>
    );
    const orderListButtons = container.querySelectorAll(
      ".filterButtons > button"
    );
    fireEvent.click(orderListButtons[1]);
    expect(
      screen.getAllByTestId("companyCard")[0].querySelector("button")
    ).toHaveTextContent("A company");
  });
  it("change filter correctly", () => {
    const { container } = render(
      <I18nProvider>
        <AccountContextWrapper>
          <CompaniesSidePanel companies={companies} />
        </AccountContextWrapper>
      </I18nProvider>
    );
    fireEvent.change(container.querySelector("#filter"), {
      target: { value: "Z company" }
    });
    fireEvent.click(
      screen.getAllByTestId("companyCard")[0].querySelector("button")
    );
    expect(screen.getAllByTestId("companyCard")).toHaveLength(1);
  });
});
