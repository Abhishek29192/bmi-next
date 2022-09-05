import React from "react";
import { renderWithUserProvider } from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import ApolloProvider from "../../../lib/tests/fixtures/apollo";
import { generateGlobalPageData } from "../../../lib/tests/factories/globalPageData";
import { Layout } from "../";

describe("Layout", () => {
  it("renders correctly", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <Layout title="Public page" pageData={generateGlobalPageData()}>
            <>body</>
          </Layout>
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly without page data", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <Layout title="Public page">
            <>body</>
          </Layout>
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with empty page data", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <Layout title="Public page" pageData={null}>
            <>body</>
          </Layout>
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
