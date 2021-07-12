import React, { useRef } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import {
  ProjectMember,
  Account,
  CertificationsConnection
} from "@bmi/intouch-api-types";
import { TeamTab } from "..";
import I18nextProvider from "../../../../lib/tests/fixtures/i18n";

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

describe("TeamTab Components", () => {
  const teams: ProjectMember[] = [
    {
      nodeId: "1",
      id: 1,
      createdAt: "01/01/01",
      updatedAt: "01/01/01",
      account: {
        nodeId: "1",
        id: 1,
        firstName: "",
        lastName: "",
        role: "INSTALLER",
        certificationsByDoceboUserId: {
          nodes: [
            {
              nodeId: "1",
              id: 1,
              technology: "PITCHED",
              createdAt: "01/01/01",
              updatedAt: "01/01/01"
            }
          ]
        } as CertificationsConnection
      } as Account
    },
    {
      nodeId: "2",
      id: 2,
      createdAt: "01/01/01",
      updatedAt: "01/01/01",
      account: {
        nodeId: "1",
        id: 1,
        firstName: "",
        lastName: "",
        role: "INSTALLER",
        certificationsByDoceboUserId: {
          nodes: [
            {
              nodeId: "1",
              id: 1,
              technology: "PITCHED",
              createdAt: "01/01/01",
              updatedAt: "01/01/01"
            },
            {
              nodeId: "2",
              id: 2,
              technology: "PITCHED",
              createdAt: "01/01/01",
              updatedAt: "01/01/01"
            }
          ]
        } as CertificationsConnection
      } as Account
    },
    {
      nodeId: "3",
      id: 3,
      createdAt: "01/01/01",
      updatedAt: "01/01/01",
      account: {
        nodeId: "1",
        id: 1,
        firstName: "",
        lastName: "",
        role: "INSTALLER",
        certificationsByDoceboUserId: {
          nodes: [
            {
              nodeId: "1",
              id: 1,
              technology: "PITCHED",
              createdAt: "01/01/01",
              updatedAt: "01/01/01"
            },
            {
              nodeId: "2",
              id: 2,
              technology: "FLAT",
              createdAt: "01/01/01",
              updatedAt: "01/01/01"
            },
            {
              nodeId: "3",
              id: 3,
              technology: "OTHER",
              createdAt: "01/01/01",
              updatedAt: "01/01/01"
            }
          ]
        } as CertificationsConnection
      } as Account
    }
  ];
  describe("render correct number of team members", () => {
    it("none", () => {
      render(
        <I18nextProvider>
          <TeamTab teams={[]} />
        </I18nextProvider>
      );
      expect(screen.queryByTestId("team-item")).toBeNull();
    });
    it("one team member", () => {
      render(
        <I18nextProvider>
          <TeamTab teams={[teams[0]]} />
        </I18nextProvider>
      );
      expect(screen.getAllByTestId("team-item")).toHaveLength(1);
    });
    it("3 team members", () => {
      render(
        <I18nextProvider>
          <TeamTab teams={teams} />
        </I18nextProvider>
      );
      expect(screen.getAllByTestId("team-item")).toHaveLength(3);
    });
  });
  describe("Certification", () => {
    it("none", () => {
      render(
        <I18nextProvider>
          <TeamTab teams={[]} />
        </I18nextProvider>
      );
      expect(screen.queryByTestId("team-item-certification")).toBeNull();
    });
    it("should render certifications", () => {
      render(
        <I18nextProvider>
          <TeamTab teams={teams} />
        </I18nextProvider>
      );

      expect(screen.getAllByTestId("icon-PITCHED")).toHaveLength(3);
      expect(screen.getAllByTestId("icon-FLAT")).toHaveLength(1);
      expect(screen.getAllByTestId("icon-OTHER")).toHaveLength(1);
    });
  });

  it("remove team member on delete click", async () => {
    render(
      <I18nextProvider>
        <TeamTab teams={teams} />
      </I18nextProvider>
    );
    const deleteButton = await waitFor(() =>
      screen.getAllByTestId("team-member-delete")
    );

    fireEvent.click(deleteButton[0]);

    expect(screen.getAllByTestId("team-item")).toHaveLength(2);
  });
});
