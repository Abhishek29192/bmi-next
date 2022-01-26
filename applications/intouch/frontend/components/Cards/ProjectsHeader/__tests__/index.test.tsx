import React from "react";
import { Technology } from "@bmi/intouch-api-types";
import {
  renderWithI18NProvider,
  renderWithUserProvider,
  screen
} from "../../../../lib/tests/utils";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { GuaranteeStatus } from "../../../../lib/utils/guarantee";
import { generateAccount } from "../../../../lib/tests/factories/account";
import { ProjectsHeader } from "..";

const projectHeaderData = {
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
  guaranteeStatus: "NOT_APPLICABLE" as GuaranteeStatus
};

describe("ProjectsHeader component", () => {
  it("render correctly", () => {
    const { container } = renderWithI18NProvider(
      <ProjectsHeader {...projectHeaderData} />
    );
    expect(container).toMatchSnapshot();
  });
  it("should show guarante event button if the user is super admin", () => {
    renderWithUserProvider(
      <AccountContextWrapper account={generateAccount({ role: "SUPER_ADMIN" })}>
        <ProjectsHeader
          {...projectHeaderData}
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
          {...projectHeaderData}
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
          {...projectHeaderData}
          guaranteeEventType={"ASSIGN_SOLUTION"}
        />
      </AccountContextWrapper>
    );
    expect(screen.queryByTestId("guarantee-event-button")).toBeFalsy();
  });
});
