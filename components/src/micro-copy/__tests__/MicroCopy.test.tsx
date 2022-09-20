import React from "react";
import { render } from "@testing-library/react";
import MicroCopy, { getMicroCopy } from "../MicroCopy";

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

describe("MicroCopy tests", () => {
  describe("getMicroCopy function tests", () => {
    describe("When Microcopy is found", () => {
      describe("And function is called with prefixMC = true", () => {
        it("renders correctly without MC prefix", () => {
          const result = getMicroCopy(
            { someKey: "someValue" },
            "someKey",
            {},
            true
          );
          expect(result).toEqual("someValue");
        });
      });
      describe("And function is called with prefixMC = false", () => {
        it("renders correctly without MC prefix", () => {
          const result = getMicroCopy(
            { someKey: "someValue" },
            "someKey",
            {},
            false
          );
          expect(result).toEqual("someValue");
        });
      });
    });
    describe("When Microcopy is NOT found", () => {
      describe("And function is called with prefixMC = true", () => {
        it("renders correctly with MC prefix", () => {
          const result = getMicroCopy(
            { someKey: "someValue" },
            "test",
            {},
            true
          );
          expect(result).toEqual("MC:test");
        });

        it("renders correctly when values is undefined", () => {
          const result = getMicroCopy(undefined, "test", {}, true);
          expect(result).toEqual("MC:test");
        });

        it("renders correctly when placeholders is undefined", () => {
          const result = getMicroCopy(undefined, "test", undefined, true);
          expect(result).toEqual("MC:test");
        });
      });

      describe("And function is called with prefixMC = false", () => {
        it("renders correctly without MC prefix", () => {
          const result = getMicroCopy(
            { someKey: "someValue" },
            "test",
            {},
            false
          );
          expect(result).toEqual("test");
        });
      });
    });
  });

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
});
