import React from "react";
import { renderWithUserProvider } from "../../../../lib/tests/utils";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import MarketContextWrapper from "../../../../lib/tests/fixtures/market";
import { generateProject } from "../../../../lib/tests/factories/project";
import ProjectForm from "../Form";

const mockOnSubmit = jest.fn();

describe("Add/Edit project form", () => {
  it("Should match snapshot for Project edit", () => {
    const container = renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <ProjectForm
            project={generateProject()}
            onSubmit={mockOnSubmit}
            isSubmitting={false}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(container).toMatchSnapshot();
  });
  it("Check APPROVED guarantee status snapshot", () => {
    const project = generateProject();
    project.guarantees.nodes[0].status = "APPROVED";
    const container = renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <ProjectForm
            project={project}
            onSubmit={mockOnSubmit}
            isSubmitting={false}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(container).toMatchSnapshot();
  });
  it("Check empty guarantee snapshot", () => {
    const project = generateProject();
    project.guarantees.nodes = [undefined];
    const container = renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <ProjectForm
            project={project}
            onSubmit={mockOnSubmit}
            isSubmitting={false}
          />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(container).toMatchSnapshot();
  });
  it("Should match snapshot for Project add", () => {
    const container = renderWithUserProvider(
      <MarketContextWrapper>
        <AccountContextWrapper>
          <ProjectForm onSubmit={mockOnSubmit} isSubmitting={false} />
        </AccountContextWrapper>
      </MarketContextWrapper>
    );
    expect(container).toMatchSnapshot();
  });
});
