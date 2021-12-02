import React from "react";
import ApolloProvider from "../../../../lib/tests/fixtures/apollo";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { screen, renderWithUserProvider } from "../../../../lib/tests/utils";
import { mockCompany } from "../../../../fixtures/company";

import { CompanyActionsCard } from "..";

const mockUpdateCompanyDetailsMutation = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useUpdateCompanyDetailsMutation: () => [mockUpdateCompanyDetailsMutation]
}));
describe("Company Actions", () => {
  it("should render deactivate button", () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <CompanyActionsCard title={"title"} company={mockCompany} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(screen.getByText("companyActions.deactivate")).toBeInTheDocument();
  });

  it("should update company status", () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <CompanyActionsCard title={"title"} company={mockCompany} />
        </AccountContextWrapper>
      </ApolloProvider>
    );

    const actionButton = screen.getByTestId("action-button");
    actionButton.click();
    expect(mockUpdateCompanyDetailsMutation).toHaveBeenCalledWith({
      variables: {
        input: {
          id: mockCompany.id,
          patch: {
            status: "DEACTIVATED"
          }
        }
      }
    });
  });
});
