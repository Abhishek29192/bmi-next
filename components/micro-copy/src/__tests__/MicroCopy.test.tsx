import React from "react";
import { render } from "@testing-library/react";
import MicroCopy from "../";

const ProviderMock = ({ children }: { children: React.ReactNode }) => {
  return (
    <MicroCopy.Provider
      values={{
        first: "Lorem firstKey",
        second: `
          Lorem {{firstKey}};
          Another occurrence: {{firstKey}};
          A second key: {{secondKey}};`
      }}
    >
      {children}
    </MicroCopy.Provider>
  );
};

describe("MicroCopy component", () => {
  it("renders correctly without replacement", () => {
    const { container } = render(
      <>
        <ProviderMock>
          Without placeholders (but they are passed):{" "}
          <MicroCopy
            path="first"
            placeholders={{
              firstKey: `This shouldn't be showing because the key usage isn't wrapped with {{}}`
            }}
          />
          With placeholders (but they are not passed):{" "}
          <MicroCopy path="second" />
        </ProviderMock>
        <MicroCopy path="not.existing" />
      </>
    );
    expect(container).toMatchSnapshot();
  });

  it("replaces all occurrences", () => {
    const { container } = render(
      <ProviderMock>
        <MicroCopy
          path="second"
          placeholders={{
            firstKey: "firstKey replaced",
            secondKey: "second key replaced"
          }}
        />
      </ProviderMock>
    );
    expect(container).toMatchSnapshot();
  });

  it("does not replace placeholders unless passed", () => {
    const { container } = render(
      <ProviderMock>
        Only firstKey should be replaced:{" "}
        <MicroCopy
          path="second"
          placeholders={{
            firstKey: "firstKey replaced"
          }}
        />
      </ProviderMock>
    );
    expect(container).toMatchSnapshot();
  });
});
