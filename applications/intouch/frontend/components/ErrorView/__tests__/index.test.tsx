import React from "react";
import { render } from "@testing-library/react";
import UserProvider from "../../../lib/tests/fixtures/user";
import I18nextProvider from "../../../lib/tests/fixtures/i18n";
import ErrorView from "..";

describe("ErrorView component", () => {
  it("renders correctly without title", () => {
    const { container } = render(
      <I18nextProvider>
        <UserProvider>
          <ErrorView statusCode={400} />
        </UserProvider>
      </I18nextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with title", () => {
    const { container } = render(
      <I18nextProvider>
        <UserProvider>
          <ErrorView statusCode={400} title="Access Denied" />
        </UserProvider>
      </I18nextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
