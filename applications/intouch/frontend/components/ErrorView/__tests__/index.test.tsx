import React from "react";
import { renderWithUserProvider } from "../../../lib/tests/utils";
import ErrorView from "..";

describe("ErrorView component", () => {
  it("renders correctly without title", () => {
    const { container } = renderWithUserProvider(
      <ErrorView statusCode={400} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with title", () => {
    const { container } = renderWithUserProvider(
      <ErrorView statusCode={400} title="Access Denied" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
