import React from "react";
import { Technology } from "@bmi/intouch-api-types";
import merge from "lodash/merge";
import {
  fireEvent,
  renderWithUserProvider,
  screen
} from "../../../../lib/tests/utils";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { GuaranteeStatus } from "../../../../lib/utils/guarantee";
import { generateAccount } from "../../../../lib/tests/factories/account";
import { ProjectsHeader } from "..";

const mockGuaranteeEventHandler = jest.fn();

const defaultProjectHeaderData = {
  title: "Old Brompton Library",
  technology: "FLAT" as Technology,
  projectCode: "PROFLO-d1847",
  projectStatus: "In progress",
  roofArea: 100,
  buildingAddress: {
    firstLine: "8 Old Brompton Road",
    secondLine: "South Kensington",
    town: "London",
    postcode: "SW7 3SS"
  },
  projectDescription: "Lorem ipsum dolor sit amet",
  startDate: "24 Feb 2021",
  endDate: "30 March 2022",
  guaranteeType: "Not requested",
  guaranteeStatus: "NOT_APPLICABLE" as GuaranteeStatus,
  hidden: true
};

export const generateProjectHeaderData = (projectHeaderData = {}) =>
  merge(defaultProjectHeaderData, projectHeaderData);

describe("ProjectsHeader component", () => {
  it("render correctly", () => {
    const { container } = renderWithUserProvider(
      <AccountContextWrapper account={generateAccount({ role: "SUPER_ADMIN" })}>
        <ProjectsHeader {...generateProjectHeaderData()} />
      </AccountContextWrapper>
    );
    expect(container).toMatchSnapshot();
  });
  it("should show guarante event button if the user is super admin", () => {
    renderWithUserProvider(
      <AccountContextWrapper account={generateAccount({ role: "SUPER_ADMIN" })}>
        <ProjectsHeader
          {...generateProjectHeaderData()}
          guaranteeEventType={"ASSIGN_SOLUTION"}
        />
      </AccountContextWrapper>
    );
    expect(screen.getByTestId("guarantee-event-button")).toBeTruthy();
  });
  it("should show guarante event button if the user is market admin", () => {
    renderWithUserProvider(
      <AccountContextWrapper
        account={generateAccount({ role: "MARKET_ADMIN" })}
      >
        <ProjectsHeader
          {...generateProjectHeaderData()}
          guaranteeEventType={"ASSIGN_SOLUTION"}
        />
      </AccountContextWrapper>
    );
    expect(screen.getByTestId("guarantee-event-button")).toBeTruthy();
  });

  it("should not show guarante event button if the user is installer", () => {
    renderWithUserProvider(
      <AccountContextWrapper account={generateAccount({ role: "INSTALLER" })}>
        <ProjectsHeader
          {...generateProjectHeaderData()}
          guaranteeEventType={"ASSIGN_SOLUTION"}
        />
      </AccountContextWrapper>
    );
    expect(screen.queryByTestId("guarantee-event-button")).toBeFalsy();
  });

  it("should not show archived key/value pair for installer", () => {
    renderWithUserProvider(
      <AccountContextWrapper account={generateAccount({ role: "INSTALLER" })}>
        <ProjectsHeader
          {...generateProjectHeaderData({ hidden: false })}
          guaranteeEventType={"ASSIGN_SOLUTION"}
        />
      </AccountContextWrapper>
    );
    expect(screen.queryByTestId("archived-field")).toBeFalsy();
  });

  it("should show archived key/value pair for SUPER_ADMIN", () => {
    renderWithUserProvider(
      <AccountContextWrapper account={generateAccount({ role: "SUPER_ADMIN" })}>
        <ProjectsHeader
          {...generateProjectHeaderData({
            hidden: null,
            renderActions: () => {},
            guaranteeEventHandler: mockGuaranteeEventHandler
          })}
          guaranteeEventType={"ASSIGN_SOLUTION"}
        />
      </AccountContextWrapper>
    );
    expect(screen.queryByText("projectDetails.archived")).toBeTruthy();
    const guaranteeButton = screen.getByTestId("guarantee-event-button");
    fireEvent.click(guaranteeButton);
    expect(mockGuaranteeEventHandler).toBeCalled();
  });
});
