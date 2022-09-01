import React, { useRef } from "react";
import {
  renderAsReal,
  screen,
  waitFor,
  fireEvent
} from "../../../../lib/tests/utils";
import { projectMembers } from "../../../../fixtures/projectMembers";
import { TeamTab } from "..";
import { generateProject } from "../../../../lib/tests/factories/project";

jest.mock("@bmi-digital/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

const mockDeleteProjectMember = jest.fn(() => {});
const mockGetProjectCompanyMembersOnCompleted = jest.fn();
const mockProjectCompanyMembers = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useDeleteProjectMemberMutation: () => [
    mockDeleteProjectMember,
    { loading: false }
  ],
  useAddProjectsMemberMutation: () => [jest.fn(), { loading: false }],
  useGetProjectCompanyMembersLazyQuery: ({ onCompleted }) => {
    mockGetProjectCompanyMembersOnCompleted.mockImplementation((data) =>
      onCompleted(data)
    );
    return [mockProjectCompanyMembers, { loading: false }];
  },
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
          project={generateProject()}
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
          project={generateProject()}
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
          project={generateProject()}
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
          project={generateProject()}
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
          project={generateProject()}
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
        project={generateProject()}
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

  it("change responsible team member on checkbox click", async () => {
    renderAsReal({ account: { role: "COMPANY_ADMIN" } })(
      <TeamTab
        projectId={1}
        teams={projectMembers}
        canNominateProjectResponsible={true}
        project={generateProject()}
      />
    );

    const checkboxes = await waitFor(() =>
      screen.getAllByTestId("team-member-update-responsible")
    );
    fireEvent.click(checkboxes[0]);
    expect(screen.getAllByTestId("team-item")).toHaveLength(3);
  });

  it("open AddTeamMember modal with empty members", async () => {
    mockProjectCompanyMembers.mockImplementationOnce(() =>
      mockGetProjectCompanyMembersOnCompleted({
        companyMembers: null
      })
    );
    renderAsReal({ account: { role: "COMPANY_ADMIN" } })(
      <TeamTab
        projectId={1}
        teams={projectMembers}
        canNominateProjectResponsible={false}
        project={generateProject()}
      />
    );
    const addMember = screen.getByTestId("add-team-member-button");
    fireEvent.click(addMember);
    expect(screen.queryAllByTestId("team-member-item")).toHaveLength(0);

    const cancelButton = screen.getByText(
      "teamTab.add_team_member_modal.cancel_label"
    );
    fireEvent.click(cancelButton);
    expect(screen.queryAllByTestId("team-member-item")).toHaveLength(0);
  });
  it("open AddTeamMember modal", async () => {
    mockProjectCompanyMembers.mockImplementationOnce(() =>
      mockGetProjectCompanyMembersOnCompleted({
        companyMembers: {
          nodes: [
            {
              id: 1,
              accountId: 1,
              account: {
                id: 1,
                firstName: "firstName",
                lastName: "lastName",
                email: "email"
              }
            }
          ]
        }
      })
    );
    renderAsReal({ account: { role: "COMPANY_ADMIN" } })(
      <TeamTab
        projectId={1}
        teams={projectMembers}
        canNominateProjectResponsible={false}
        project={generateProject()}
      />
    );
    const addMember = screen.getByTestId("add-team-member-button");
    fireEvent.click(addMember);
    expect(screen.queryAllByTestId("team-member-item")).toHaveLength(1);

    const checkboxes = (await waitFor(() =>
      screen.getAllByRole("checkbox")
    )) as HTMLInputElement[];

    fireEvent.click(checkboxes[0]);
    const confirmButton = screen.getByText(
      "teamTab.add_team_member_modal.confirm_label"
    );
    fireEvent.click(confirmButton);

    expect(checkboxes[0].checked).toBeTruthy();
  });
});
