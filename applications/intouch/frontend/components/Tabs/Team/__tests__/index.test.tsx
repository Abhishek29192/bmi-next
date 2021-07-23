import React, { useRef } from "react";
import {
  renderWithI18NProvider,
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
  useDeleteProjectMemberMutation: () => [mockDeleteProjectMember],
  useAddProjectsMemberMutation: () => [jest.fn()],
  useGetProjectCompanyMembersLazyQuery: () => [jest.fn()]
}));

describe("TeamTab Components", () => {
  describe("render correct number of team members", () => {
    it("none", () => {
      renderWithI18NProvider(<TeamTab projectId={1} teams={[]} />);
      expect(screen.queryByTestId("team-item")).toBeNull();
    });
    it("one team member", () => {
      renderWithI18NProvider(
        <TeamTab projectId={1} teams={[projectMembers[0]]} />
      );
      expect(screen.getAllByTestId("team-item")).toHaveLength(1);
    });
    it("3 team members", () => {
      renderWithI18NProvider(<TeamTab projectId={1} teams={projectMembers} />);
      expect(screen.getAllByTestId("team-item")).toHaveLength(3);
    });
  });
  describe("Certification", () => {
    it("none", () => {
      renderWithI18NProvider(<TeamTab projectId={1} teams={[]} />);
      expect(screen.queryByTestId("team-item-certification")).toBeNull();
    });
    it("should render certifications", () => {
      renderWithI18NProvider(<TeamTab projectId={1} teams={projectMembers} />);

      expect(screen.getAllByTestId("icon-PITCHED")).toHaveLength(3);
      expect(screen.getAllByTestId("icon-FLAT")).toHaveLength(1);
      expect(screen.getAllByTestId("icon-OTHER")).toHaveLength(1);
    });
  });

  it("remove team member on delete click", async () => {
    renderWithI18NProvider(<TeamTab projectId={1} teams={projectMembers} />);
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
