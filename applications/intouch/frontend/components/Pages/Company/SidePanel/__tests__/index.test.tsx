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
  const companyFactory = (company = {}) => ({
    __typename: "Company" as const,
    id: 1,
    name: "A company",
    certifications: [],
    companyDocuments: emptyNodes,
    companyMembers: emptyNodes,
    companyOperationsByCompany: emptyNodes,
    isProfileComplete: true,
    referenceNumber: 10001,
    tier: "T1" as const,
    updatedAt: "2022-12-12",
    ...company
  });
  const companies: GetCompaniesByMarketQuery["companies"]["nodes"] = [
    companyFactory(),
    companyFactory({ id: 2, name: "Z company", isProfileComplete: false })
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
    expect(
      screen.getAllByTestId("companyCard")[0].querySelector("button")
    ).toHaveTextContent("search.profileComplete");
    expect(
      screen.getAllByTestId("companyCard")[1].querySelector("button")
    ).toHaveTextContent("search.profileIncomplete");
  });
  it("check order onclick behavior", async () => {
    const { container } = render(
      <I18nProvider>
        <AccountContextWrapper>
          <CompaniesSidePanel companies={companies} />
        </AccountContextWrapper>
      </I18nProvider>
    );
    const orderListButtons = container.querySelectorAll(".filterButton .Chip");
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

  it("filer correctly when sort by alphabet", () => {
    const companies: GetCompaniesByMarketQuery["companies"]["nodes"] = [
      companyFactory({ name: null }),
      companyFactory({ id: 2, name: "Z company" }),
      companyFactory({ id: 3, name: null }),
      companyFactory({ id: 4, name: "A company" })
    ];
    const { container } = render(
      <I18nProvider>
        <AccountContextWrapper>
          <CompaniesSidePanel companies={companies} />
        </AccountContextWrapper>
      </I18nProvider>
    );
    const orderListButtons = container.querySelectorAll(".filterButton .Chip");
    fireEvent.click(orderListButtons[0]);

    expect(screen.getAllByTestId("companyCard").length).toBe(4);
    expect(
      screen.getAllByTestId("companyCard")[0].querySelector("button")
    ).toHaveTextContent("A company");
    expect(
      screen.getAllByTestId("companyCard")[1].querySelector("button")
    ).toHaveTextContent("Z company");
  });

  it("filer correctly when sort by updatedAt", () => {
    const companies: GetCompaniesByMarketQuery["companies"]["nodes"] = [
      companyFactory({ name: "A company", updatedAt: "2021-12-2" }),
      companyFactory({ name: "Z company", updatedAt: "2021-12-3" }),
      companyFactory({ name: "B company", updatedAt: "2021-12-1" }),
      companyFactory({ name: "C company", updatedAt: "2021-12-4" })
    ];
    const { container } = render(
      <I18nProvider>
        <AccountContextWrapper>
          <CompaniesSidePanel companies={companies} />
        </AccountContextWrapper>
      </I18nProvider>
    );
    const orderListButtons = container.querySelectorAll(".filterButton .Chip");
    fireEvent.click(orderListButtons[1]);

    expect(screen.getAllByTestId("companyCard").length).toBe(4);
    expect(
      screen.getAllByTestId("companyCard")[0].querySelector("button")
    ).toHaveTextContent("C company");
    expect(
      screen.getAllByTestId("companyCard")[1].querySelector("button")
    ).toHaveTextContent("Z company");
    expect(
      screen.getAllByTestId("companyCard")[2].querySelector("button")
    ).toHaveTextContent("A company");
    expect(
      screen.getAllByTestId("companyCard")[3].querySelector("button")
    ).toHaveTextContent("B company");
  });
});
