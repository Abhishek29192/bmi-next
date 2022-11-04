import { render, screen } from "@testing-library/react";
import React from "react";
import CompanyPageContextWrapper, {
  useCompanyPageContext,
  CompanyPageContext
} from "../CompanyPageContext";

describe("ProjectPageContext", () => {
  const value = { operationTypes: ["type1", "type2"] };
  it("render correctly", () => {
    render(
      <CompanyPageContextWrapper value={value}>
        <CompanyPageContext.Consumer>
          {({ operationTypes }) => <div>{operationTypes}</div>}
        </CompanyPageContext.Consumer>
      </CompanyPageContextWrapper>
    );

    expect(screen.getByText("type1type2")).toBeTruthy();
  });

  it("useProjectPageContext", () => {
    function ChildComponent() {
      const { operationTypes } = useCompanyPageContext();
      return <div>{operationTypes}</div>;
    }
    render(
      <CompanyPageContextWrapper value={value}>
        <ChildComponent />
      </CompanyPageContextWrapper>
    );

    expect(screen.getByText("type1type2")).toBeTruthy();
  });

  it("useProjectPageContext default value", () => {
    function ChildComponent() {
      const { operationTypes } = useCompanyPageContext();
      return <div data-testid="operationType">{operationTypes}</div>;
    }

    render(<ChildComponent />);

    expect(screen.getByTestId("operationType")).toHaveTextContent("");
  });
});
