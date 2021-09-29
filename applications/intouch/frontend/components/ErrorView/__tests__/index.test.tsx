import React from "react";
import { renderWithUserProvider } from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import ApolloProvider from "../../../lib/tests/fixtures/apollo";
import { generateGlobalPageData } from "../../../lib/tests/factories/globalPageData";
import ErrorView from "..";

describe("ErrorView component", () => {
  it("renders correctly without title", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ErrorView
            statusCode={400}
            globalPageData={generateGlobalPageData()}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with title", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ErrorView
            statusCode={400}
            title="Access Denied"
            globalPageData={generateGlobalPageData()}
          />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
