import React from "react";
import { render } from "@testing-library/react";
import MicroCopy from "../";

const ProviderMock = ({ children }: { children: React.ReactNode }) => {
  return (
    <MicroCopy.Provider
      values={{ first: "Lorem Ipsum", second: "Lorem {{ipsum}}" }}
    >
      {children}
    </MicroCopy.Provider>
  );
};

describe("MicroCopy component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <>
        <ProviderMock>
          <MicroCopy path="first" />
          <MicroCopy path="second" />
        </ProviderMock>
        <MicroCopy path="not.existing" />
      </>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
