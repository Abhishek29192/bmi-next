import { render, screen } from "@testing-library/react";
import React from "react";
import ProjectPageContextWrapper, {
  useProjectPageContext,
  ProjectPageContext
} from "../ProjectPageContext";

describe("ProjectPageContext", () => {
  const value = {
    test: "test"
  };
  it("render correctly", () => {
    render(
      <ProjectPageContextWrapper value={value}>
        <ProjectPageContext.Consumer>
          {({ test }) => <div>{test}</div>}
        </ProjectPageContext.Consumer>
      </ProjectPageContextWrapper>
    );

    expect(screen.getByText("test")).toBeTruthy();
  });

  it("useProjectPageContext", () => {
    function ChildComponent() {
      const { test } = useProjectPageContext();
      return <div>{test}</div>;
    }
    render(
      <ProjectPageContextWrapper value={value}>
        <ChildComponent />
      </ProjectPageContextWrapper>
    );

    expect(screen.getByText("test")).toBeTruthy();
  });
});
