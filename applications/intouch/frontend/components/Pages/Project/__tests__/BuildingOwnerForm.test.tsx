import React from "react";
import { renderWithUserProvider } from "../../../../lib/tests/utils";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import MarketContextWrapper from "../../../../lib/tests/fixtures/market";
import { generateProject } from "../../../../lib/tests/factories/project";
import ProjectForm from "../BuildingOwnerForm";

const mockOnSubmit = jest.fn();

describe("Add/Edit Building Owner Details", () => {
  it("Should match snapshot for Details edit", () => {
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
  it("Should match snapshot for Details add", () => {
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
