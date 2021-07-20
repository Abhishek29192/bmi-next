import React from "react";
import { renderWithUserProvider } from "../../../lib/tests/utils";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import ErrorView from "..";

describe("ErrorView component", () => {
  it("renders correctly without title", () => {
    const { container } = renderWithUserProvider(
      <AccountContextWrapper>
        <ErrorView statusCode={400} />
      </AccountContextWrapper>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with title", () => {
    const { container } = renderWithUserProvider(
      <AccountContextWrapper>
        <ErrorView statusCode={400} title="Access Denied" />
      </AccountContextWrapper>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
