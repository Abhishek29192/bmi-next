import "@testing-library/jest-dom";
import React, { useRef } from "react";
import {
  render,
  fireEvent,
  screen,
  within,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";
import I18nProvider from "../../../../../lib/tests/fixtures/i18n";
import Apollo from "../../../../../lib/tests/fixtures/apollo";
import CompanyMembersPage, { PageProps } from "..";
import {
  adminTeamMembers,
  teamMembers,
  installerTeamMembers
} from "../../../../../fixtures/teamMembers";
import { useAccountContext } from "../../../../../context/AccountContext";
import { TeamMembersQuery } from "../../../../../graphql/generated/operations";

const inviteMock = jest.fn();
const mockDelete = jest.fn();
const mockCompanyMembers = jest.fn();
const mockRoleAccountMutation = jest.fn();

jest.mock("../../../../../graphql/generated/hooks", () => ({
  __esModule: true,
  useInviteMutation: () => [inviteMock, { loading: false }],
  useDeleteCompanyMemberMutation: () => [mockDelete, { loading: false }],
  useTeamMembersLazyQuery: () => [mockCompanyMembers, { loading: false }],
  useUpdateRoleAccountMutation: () => [
    mockRoleAccountMutation,
    { loading: false }
  ],
  useGetTeamsReportLazyQuery: () => [jest.fn(), { loading: false }]
}));

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

jest.mock("../../../../../context/AccountContext", () => ({
  useAccountContext: jest.fn()
}));

describe("Company Members Page", () => {
  let wrapper;

  let props: PageProps = {
    data: teamMembers
  };

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    (useAccountContext as jest.Mock).mockImplementation(() => ({
      account: { role: "COMPANY_ADMIN" }
    }));

    wrapper = render(
      <Apollo>
        <I18nProvider>
          <CompanyMembersPage {...props} />
        </I18nProvider>
      </Apollo>
    );
  });

  describe("Member List", () => {
    it("should render members if exists", () => {
      expect(wrapper.queryAllByTestId("list-item")).toHaveLength(4);
    });

    it("should render all the informations", () => {
      const elements = wrapper.getAllByTestId("list-item");
      let listItem = elements[0];
      expect(listItem).toHaveTextContent("Alex Green");
      expect(listItem).toHaveTextContent("roles.COMPANY_ADMIN");
      within(listItem).getByTestId("icon-FLAT");
      within(listItem).getByTestId("icon-PITCHED");

      listItem = elements[3];
      expect(listItem).toHaveTextContent("Aron Musk");
      expect(listItem).toHaveTextContent("roles.INSTALLER");
      within(listItem).getByTestId("icon-FLAT");
    });

    describe("Search", () => {
      describe("by name", () => {
        it("full", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "alex" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });

        it("partial", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "ale" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });
      });

      describe("by surname", () => {
        it("full", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "Green" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });

        it("partial", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "Gree" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });
      });

      describe("by email", () => {
        it("full", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "Aron@Musk.co.uk" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });

        it("partial", () => {
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "Aron@Mus" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
        });
      });

      it("should show a label if not users found", () => {
        fireEvent.change(wrapper.container.querySelector("#filter"), {
          target: { value: "abcde" }
        });
        expect(wrapper.queryAllByTestId("list-item")).toHaveLength(0);

        screen.getByText("sidePanel.search.noResult");
      });
    });
  });

  describe("Details", () => {
    it("should have a default user", () => {
      const userCard = screen.getByTestId("user-card");
      expect(userCard).toHaveTextContent("Alex Green");
      expect(userCard).toHaveTextContent("roles.COMPANY_ADMIN");
    });

    it("should show certifications", () => {
      const table = screen.getByTestId("certification-table");
      expect(table).toHaveTextContent("Certification name 1");
      expect(table).toHaveTextContent("Certification name 11");
    });

    it("show another member", async () => {
      fireEvent.click(screen.getByText("Aron Musk"));

      const userCard = screen.getByTestId("user-card");
      expect(userCard).toHaveTextContent("Aron Musk");
      expect(userCard).toHaveTextContent("roles.INSTALLER");

      const table = screen.getByTestId("certification-table");
      expect(table).toHaveTextContent("Certification name 2");
      expect(table).toHaveTextContent("Certification name 22");
    });

    describe("Member invitation", () => {
      it("should invite new users", () => {
        fireEvent.click(screen.getByTestId("footer-btn"));
        fireEvent.change(screen.getByTestId("emails"), {
          target: {
            value: "email@email.co.uk, email1@email.co.uk"
          }
        });
        fireEvent.click(screen.getByTestId("invite-dialog-submit"));

        expect(inviteMock).toHaveBeenCalledWith({
          variables: {
            input: {
              emails: ["email@email.co.uk", "email1@email.co.uk"]
            }
          }
        });
      });
    });

    describe("Remove Member", () => {
      const installerData: TeamMembersQuery = {
        accounts: {
          totalCount: 1,
          nodes: installerTeamMembers
        }
      };
      const adminData: TeamMembersQuery = {
        accounts: {
          totalCount: 3,
          nodes: adminTeamMembers
        }
      };
      it("the remove button shouldn't be visible if selected account not Installer", async () => {
        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage data={adminData} />
            </I18nProvider>
          </Apollo>
        );

        expect(
          within(wrapper.container).queryByTestId("remove-member")
        ).toBeNull();
      });

      it("Should not remove the member if press cancel", async () => {
        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage data={installerData} />
            </I18nProvider>
          </Apollo>
        );

        fireEvent.click(screen.getByTestId("remove-member"));

        await waitFor(() => screen.getByText("user_card.cancel"));

        fireEvent.click(screen.getByText("user_card.cancel"));

        await waitForElementToBeRemoved(() =>
          screen.getByText("user_card.confirm")
        );

        expect(mockDelete).toHaveBeenCalledTimes(0);
      });

      it("Should remove the member", async () => {
        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage data={installerData} />
            </I18nProvider>
          </Apollo>
        );

        fireEvent.click(screen.getByTestId("remove-member"));

        await waitFor(() => screen.getByText("user_card.confirm"));

        fireEvent.click(screen.getByText("user_card.confirm"));

        await waitForElementToBeRemoved(() =>
          screen.getByText("user_card.confirm")
        );

        mockDelete.mockResolvedValueOnce(() => ({}));

        expect(mockDelete).toHaveBeenCalledWith({
          variables: { id: 2 }
        });
      });

      it("the remove button shouldn't be visible if installer", async () => {
        (useAccountContext as jest.Mock).mockImplementation(() => ({
          account: { role: "INSTALLER" }
        }));

        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...props} />
            </I18nProvider>
          </Apollo>
        );

        expect(
          within(wrapper.container).queryByTestId("remove-member")
        ).toBeNull();
      });
    });

    describe("Change user role", () => {
      it("Should not change the member role if press cancel", async () => {
        fireEvent.click(screen.getByTestId("change-role"));

        await waitFor(() => screen.getByText("user_card.cancel"));

        fireEvent.click(screen.getByText("user_card.cancel"));

        expect(mockRoleAccountMutation).toHaveBeenCalledTimes(0);
      });
      it("Should change the role to installer", async () => {
        fireEvent.click(screen.getByTestId("change-role"));

        await waitFor(() => screen.getByText("user_card.confirm"));

        fireEvent.click(screen.getByText("user_card.confirm"));

        mockRoleAccountMutation.mockResolvedValueOnce(() => ({}));

        expect(mockRoleAccountMutation).toHaveBeenCalledWith({
          variables: { input: { id: 1, patch: { role: "INSTALLER" } } }
        });
      });

      it("Should change the role to copmany admin", async () => {
        fireEvent.click(screen.getByText("Aron Musk"));

        const userCard = screen.getByTestId("user-card");

        await waitFor(() => within(userCard).getByText("Aron Musk"));

        fireEvent.click(screen.getByTestId("change-role"));

        await waitFor(() => screen.getByText("user_card.confirm"));

        fireEvent.click(screen.getByText("user_card.confirm"));

        await waitForElementToBeRemoved(() =>
          screen.getByText("user_card.confirm")
        );

        mockRoleAccountMutation.mockResolvedValueOnce(() => ({}));

        expect(mockRoleAccountMutation).toHaveBeenCalledWith({
          variables: { input: { id: 2, patch: { role: "COMPANY_ADMIN" } } }
        });
      });

      it("the remove button shouldn't be visible if installer", async () => {
        (useAccountContext as jest.Mock).mockImplementation(() => ({
          account: { role: "INSTALLER" }
        }));

        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...props} />
            </I18nProvider>
          </Apollo>
        );

        expect(
          within(wrapper.container).queryByTestId("change-role")
        ).toBeNull();
      });
    });
    describe("User Action", () => {
      it("the user action button shouldn't be visible if installer", async () => {
        (useAccountContext as jest.Mock).mockImplementation(() => ({
          account: { role: "INSTALLER" }
        }));

        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...props} />
            </I18nProvider>
          </Apollo>
        );

        expect(
          within(wrapper.container).queryByTestId("change-user-status")
        ).toBeNull();
      });
      it("the user action button shouldn't be visible if company admin", async () => {
        (useAccountContext as jest.Mock).mockImplementation(() => ({
          account: { role: "COMPANY_ADMIN" }
        }));

        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...props} />
            </I18nProvider>
          </Apollo>
        );

        expect(
          within(wrapper.container).queryByTestId("change-user-status")
        ).toBeNull();
      });
      it("the user action button visible if super admin", async () => {
        (useAccountContext as jest.Mock).mockImplementation(() => ({
          account: { role: "SUPER_ADMIN" }
        }));

        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...props} />
            </I18nProvider>
          </Apollo>
        );

        expect(
          within(wrapper.container).getByTestId("change-user-status")
        ).toBeTruthy();
      });
    });
  });
});
