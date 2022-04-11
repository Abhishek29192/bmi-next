import React from "react";
import { renderWithUserProvider, screen } from "../../../../../lib/tests/utils";
import ApolloProvider from "../../../../../lib/tests/fixtures/apollo";
import AccountContextWrapper from "../../../../../lib/tests/fixtures/account";
import { CompanyAdmins } from "..";
import { mockCompany } from "../../../../../fixtures/company";

describe("CompanyAdmins Components", () => {
  it("render correctly if there is no members", () => {
    const mockMembers = [];
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <CompanyAdmins admins={mockMembers} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("render correctly if there is members", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <CompanyAdmins admins={mockCompany.companyMembers.nodes} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("check for correct behavior on Show More button click", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <CompanyAdmins count={2} admins={mockCompany.companyMembers.nodes} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    const moreButton = screen.getByText("button.more");
    moreButton.click();
    expect(container).toMatchSnapshot();
  });
});
