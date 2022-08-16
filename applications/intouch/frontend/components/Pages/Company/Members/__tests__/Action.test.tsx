import React from "react";
import {
  fireEvent,
  renderWithI18NProvider,
  screen
} from "../../../../../lib/tests/utils";
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

  const suspendedMember = {
    ...memberMock,
    status: "SUSPENDED"
  } as TeamMembersQuery["accounts"]["nodes"][0];

  it("show Deactivate user button", () => {
    renderWithI18NProvider(<CompanyMemberActionCard member={memberMock} />);

    expect(screen.queryByTestId("change-user-status")).toHaveTextContent(
      "userActions.action.deactivate"
    );
  });

  it("show Activate user button", () => {
    renderWithI18NProvider(
      <CompanyMemberActionCard member={suspendedMember} />
    );

    expect(screen.queryByTestId("change-user-status")).toHaveTextContent(
      "userActions.action.activate"
    );
  });

  it("return null if no member", () => {
    const { container } = renderWithI18NProvider(
      <CompanyMemberActionCard member={null} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should run toggleCompanyMemberAction when button click", () => {
    const onAccountUpdateMock = jest.fn();
    renderWithI18NProvider(
      <CompanyMemberActionCard
        member={memberMock}
        onAccountUpdate={onAccountUpdateMock}
      />
    );
    const button = screen.queryByTestId("change-user-status");
    fireEvent.click(button);

    expect(onAccountUpdateMock).toHaveBeenCalledWith(1, "SUSPENDED");
  });
});
