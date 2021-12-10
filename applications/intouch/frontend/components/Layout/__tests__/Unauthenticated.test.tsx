import React from "react";
import { renderWithUserProvider } from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import ApolloProvider from "../../../lib/tests/fixtures/apollo";
import { generateGlobalPageData } from "../../../lib/tests/factories/globalPageData";
import { Layout } from "../Unauthenticated";

describe("ErrorView component", () => {
  it("renders correctly without title", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <Layout title="Public page" pageData={generateGlobalPageData()}>
            <>body</>
          </Layout>
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly when error", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <Layout
            title="Public page"
            isError={true}
            pageData={generateGlobalPageData()}
          >
            <>body</>
          </Layout>
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
