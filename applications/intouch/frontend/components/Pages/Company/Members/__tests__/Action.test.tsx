import React from "react";
import { renderWithI18NProvider, screen } from "../../../../../lib/tests/utils";
import { TeamMembersQuery } from "../../../../../graphql/generated/operations";
import CompanyMemberActionCard from "../Action";

describe("CompanyMemberActionCard Components", () => {
  const memberMock = {
    id: 1,
    role: "INSTALLER",
    firstName: "firstName",
    lastName: "lastName",
    status: "ACTIVE"
  } as TeamMembersQuery["accounts"]["nodes"][0];
  it("show Deactivate user button", () => {
    renderWithI18NProvider(<CompanyMemberActionCard member={memberMock} />);

    expect(screen.queryByTestId("change-user-status")).toHaveTextContent(
      "userActions.action.deactivate"
    );
  });
  it("show Activate user button", () => {
    const suspendedMember = {
      ...memberMock,
      status: "SUSPENDED"
    } as TeamMembersQuery["accounts"]["nodes"][0];
    renderWithI18NProvider(
      <CompanyMemberActionCard member={suspendedMember} />
    );

    expect(screen.queryByTestId("change-user-status")).toHaveTextContent(
      "userActions.action.activate"
    );
  });
});
