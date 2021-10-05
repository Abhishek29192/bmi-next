import React, { useRef } from "react";
import { CompanyMember } from "@bmi/intouch-api-types";
import { AddTeamMemberDialog } from "../AddTeamMemberDialog";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

const members = [
  {
    id: 2,
    company: {
      name: "Company name"
    },
    account: {
      id: 2,
      role: "INSTALLER",
      formattedRole: "Installer",
      email: "Aron@Musk.co.uk",
      firstName: "Aron",
      lastName: "Musk",
      certificationsByDoceboUserId: {
        nodes: [
          {
            expiryDate: "2021-12-31 12:00:00",
            name: "Certification name 2",
            technology: "FLAT"
          },
          {
            expiryDate: "2021-12-31 12:00:00",
            name: "Certification name 22",
            technology: "PITCHED"
          }
        ]
      }
    }
  },
  {
    id: 1,
    company: {
      name: "Company name"
    },
    account: {
      id: 1,
      role: "COMPANY_ADMIN",
      formattedRole: "Company Admin",
      email: "Alex@Green.co.uk",
      firstName: "Alex",
      lastName: "Green",
      certificationsByDoceboUserId: {
        nodes: [
          {
            expiryDate: "2021-12-31 12:00:00",
            name: "Certification name 1",
            technology: "FLAT"
          },
          {
            expiryDate: "2021-12-31 12:00:00",
            name: "Certification name 11",
            technology: "PITCHED"
          }
        ]
      }
    }
  },
  {
    id: 3,
    company: {
      name: "Company name"
    },
    account: {
      id: 3,
      role: "COMPANY_ADMIN",
      formattedRole: "Company Admin",
      email: "Elon@Gates.co.uk",
      firstName: "Elon",
      lastName: "Gates",
      certificationsByDoceboUserId: {
        nodes: [
          {
            expiryDate: "2021-12-31 12:00:00",
            name: "Certification name 3",
            technology: "PITCHED"
          }
        ]
      }
    }
  },
  {
    id: 4,
    company: {
      name: "Company name"
    },
    account: {
      id: 4,
      role: "COMPANY_ADMIN",
      formattedRole: "Company Admin",
      email: "Luke@Skywalker.co.uk",
      firstName: "Luke",
      lastName: "Skywalker",
      certificationsByDoceboUserId: {
        nodes: []
      }
    }
  }
];

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
        members={members as CompanyMember[]}
      />
    );
    expect(screen.getAllByTestId("team-member-item")).toHaveLength(4);
  });
});
