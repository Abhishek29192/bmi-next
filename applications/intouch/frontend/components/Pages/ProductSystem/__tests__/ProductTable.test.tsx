import React from "react";
import { renderWithUserProvider } from "../../../../lib/tests/utils";
import ApolloProvider from "../../../../lib/tests/fixtures/apollo";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { ProductTable } from "../ProductTable";
import { generateProduct } from "../../../../lib/tests/factories/product";

describe("ProductTable Component", () => {
  it("render correctly if there is no products", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ProductTable products={[]} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("render correctly if there is products", () => {
    const mockProducts = [generateProduct()];
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper>
          <ProductTable products={mockProducts} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
