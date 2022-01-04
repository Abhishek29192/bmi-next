import React, { useRef } from "react";
import {
  renderAsReal,
  screen,
  waitFor,
  fireEvent
} from "../../../../lib/tests/utils";
import { projectMembers } from "../../../../fixtures/projectMembers";
import { TeamTab } from "..";

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

const mockDeleteProjectMember = jest.fn(() => {});
jest.mock("../../../../graphql/generated/hooks", () => ({
  useDeleteProjectMemberMutation: () => [
    mockDeleteProjectMember,
    { loading: false }
  ],
  useAddProjectsMemberMutation: () => [jest.fn(), { loading: false }],
  useGetProjectCompanyMembersLazyQuery: () => [jest.fn(), { loading: false }],
  useUpdateProjectMemberMutation: () => [jest.fn(), { loading: false }]
}));

describe("TeamTab Components", () => {
  describe("render correct number of team members", () => {
    it("none", () => {
      renderAsReal({ account: { role: "COMPANY_ADMIN" } })(
        <TeamTab
          projectId={1}
          teams={[]}
          canNominateProjectResponsible={false}
        />
      );
      expect(screen.queryByTestId("team-item")).toBeNull();
    });
    it("one team member", () => {
      renderAsReal({ account: { role: "COMPANY_ADMIN" } })(
        <TeamTab
          projectId={1}
          teams={[projectMembers[0]]}
          canNominateProjectResponsible={false}
        />
      );
      expect(screen.getAllByTestId("team-item")).toHaveLength(1);
    });
    it("3 team members", () => {
      renderAsReal({ account: { role: "COMPANY_ADMIN" } })(
        <TeamTab
          projectId={1}
          teams={projectMembers}
          canNominateProjectResponsible={false}
        />
      );
      expect(screen.getAllByTestId("team-item")).toHaveLength(3);
    });
  });
  describe("Certification", () => {
    it("none", () => {
      renderAsReal({ account: { role: "COMPANY_ADMIN" } })(
        <TeamTab
          projectId={1}
          teams={[]}
          canNominateProjectResponsible={false}
        />
      );
      expect(screen.queryByTestId("team-item-certification")).toBeNull();
    });
    it("should render certifications", () => {
      renderAsReal({ account: { role: "COMPANY_ADMIN" } })(
        <TeamTab
          projectId={1}
          teams={projectMembers}
          canNominateProjectResponsible={false}
        />
      );

      expect(screen.getAllByTestId("icon-PITCHED")).toHaveLength(3);
      expect(screen.getAllByTestId("icon-FLAT")).toHaveLength(1);
      expect(screen.getAllByTestId("icon-OTHER")).toHaveLength(1);
    });
  });

  it("remove team member on delete click", async () => {
    renderAsReal({ account: { role: "COMPANY_ADMIN" } })(
      <TeamTab
        projectId={1}
        teams={projectMembers}
        canNominateProjectResponsible={false}
      />
    );
    const deleteButton = await waitFor(() =>
      screen.getAllByTestId("team-member-delete")
    );
    deleteButton[0].onclick = jest.fn(() => {
      screen.getAllByTestId("team-item")[0].remove();
    });

    fireEvent.click(deleteButton[0]);

    expect(screen.getAllByTestId("team-item")).toHaveLength(2);
  });
});
