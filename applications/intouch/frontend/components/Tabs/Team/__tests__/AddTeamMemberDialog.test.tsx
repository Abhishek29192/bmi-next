import React, { useRef } from "react";
import { CompanyMember } from "@bmi/intouch-api-types";
import { AddTeamMemberDialog } from "../AddTeamMemberDialog";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
import { companyMembers } from "../../../../fixtures/companyMembers";

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));
describe("AddTeamMemberDialog Components", () => {
  it("non team member", () => {
    renderWithI18NProvider(
      <AddTeamMemberDialog
        isOpen={false}
        onCloseClick={null}
        onConfirmClick={null}
        members={[]}
      />
    );
    expect(screen.queryByTestId("team-member-item")).toBeNull();
  });

  it("should show four team members", () => {
    renderWithI18NProvider(
      <AddTeamMemberDialog
        isOpen={true}
        onCloseClick={null}
        onConfirmClick={null}
        members={companyMembers.companyMembers.nodes as CompanyMember[]}
      />
    );
    expect(screen.getAllByTestId("team-member-item")).toHaveLength(4);
  });
});
