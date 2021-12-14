import React, { useRef } from "react";
import { renderWithUserProvider } from "../../../../../lib/tests/utils";
import ApolloProvider from "../../../../../lib/tests/fixtures/apollo";
import AccountContextWrapper from "../../../../../lib/tests/fixtures/account";
import { CompanyDocuments } from "..";

describe("CompanyDocuments Components", () => {
  it("render correctly if there is no document", () => {
    const mockDocuments = {
      nodes: []
    };
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <CompanyDocuments companyId={1} documents={mockDocuments} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("render correctly if there is document", () => {
    const mockDocuments = {
      nodes: [
        {
          id: 1,
          document: "document",
          createdAt: "2020-12-12",
          updatedAt: "2020-12-12"
        }
      ]
    };
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <CompanyDocuments companyId={1} documents={mockDocuments} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
