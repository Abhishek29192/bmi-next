import React, { useRef } from "react";
import {
  render,
  fireEvent,
  screen,
  within,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";
import { Certification } from "@bmi/intouch-api-types";
import I18nProvider from "../../../../../lib/tests/fixtures/i18n";
import Apollo from "../../../../../lib/tests/fixtures/apollo";
import CompanyMembersPage, { PageProps } from "..";
import {
  adminTeamMembers,
  teamMembers,
  installerTeamMembers
} from "../../../../../fixtures/teamMembers";
import { projectFactory } from "../../../../../lib/tests/factories/project";
import { useAccountContext } from "../../../../../context/AccountContext";
import { useMarketContext } from "../../../../../context/MarketContext";
import { TeamMembersQuery } from "../../../../../graphql/generated/operations";

const inviteMock = jest.fn();
const mockDelete = jest.fn();
const mockCompanyMembers = jest.fn();
const mockCompanyMembersOnCompleted = jest.fn();
const mockRoleAccountMutation = jest.fn();
const mockRoleAccountOnCompleted = jest.fn();
const mockRoleAccountOnError = jest.fn();
const mockDeleteOnCompleted = jest.fn();
const mockDeleteOnError = jest.fn();
const mockRoterPush = jest.fn();
const mockMediaQuery = jest.fn().mockReturnValue(false);
jest.mock("../../../../../graphql/generated/hooks", () => ({
  __esModule: true,
  useInviteMutation: () => [inviteMock, { loading: false }],
  useDeleteCompanyMemberMutation: ({ onCompleted, onError }) => {
    mockDeleteOnCompleted.mockImplementation(() => onCompleted());
    mockDeleteOnError.mockImplementation(() => onError());
    return [mockDelete, { loading: false }];
  },
  useTeamMembersLazyQuery: ({ onCompleted }) => {
    mockCompanyMembersOnCompleted.mockImplementation((data) =>
      onCompleted(data)
    );
    return [mockCompanyMembers, { loading: false }];
  },
  useUpdateRoleAccountMutation: ({ onCompleted, onError }) => {
    mockRoleAccountOnCompleted.mockImplementation((params) =>
      onCompleted(params)
    );
    mockRoleAccountOnError.mockImplementation((message) => onError(message));
    return [mockRoleAccountMutation, { loading: false }];
  },
  useGetTeamsReportLazyQuery: () => [jest.fn(), { loading: false }]
}));

jest.mock("@bmi-digital/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

jest.mock("../../../../../context/AccountContext", () => ({
  useAccountContext: jest.fn()
}));
jest.mock("../../../../../context/MarketContext", () => ({
  useMarketContext: jest.fn()
}));
jest.mock("next/router", () => {
  const original = jest.requireActual("next/router");
  return {
    ...original,
    useRouter: () => ({
      push: (...params) => mockRoterPush(params)
    })
  };
});
jest.mock("@material-ui/core", () => {
  const original = jest.requireActual("@material-ui/core");
  return {
    ...original,
    useMediaQuery: () => mockMediaQuery()
  };
});

describe("Company Members Page", () => {
  let wrapper;

  const props: PageProps = {
    data: teamMembers
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(() => {
    (useAccountContext as jest.Mock).mockImplementation(() => ({
      account: { id: 1, role: "COMPANY_ADMIN" }
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

      it("companyName could not be found", () => {
        const data = {
          accounts: {
            totalCount: 4,
            nodes: [
              ...adminTeamMembers,
              {
                ...installerTeamMembers[0],
                companyMembers: {
                  nodes: []
                }
              }
            ]
          }
        };
        wrapper.rerender(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...{ data }} />
            </I18nProvider>
          </Apollo>
        );
        fireEvent.change(wrapper.container.querySelector("#filter"), {
          target: { value: installerTeamMembers[0].email }
        });
        expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
      });

      it("run search correctly if a record does not contain firstname, lastName or email", () => {
        const installer = { ...installerTeamMembers[0] };
        delete installer.firstName;
        delete installer.lastName;
        delete installer.email;
        const data = {
          accounts: {
            totalCount: 1,
            nodes: [...adminTeamMembers, installer]
          }
        };
        wrapper.unmount();
        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...{ data }} />
            </I18nProvider>
          </Apollo>
        );
        fireEvent.change(wrapper.container.querySelector("#filter"), {
          target: { value: "alex" }
        });
        expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
      });

      describe("search as powerful user", () => {
        beforeEach(() => {
          (useAccountContext as jest.Mock).mockImplementation(() => ({
            account: { role: "SUPER_ADMIN" }
          }));
          (useMarketContext as jest.Mock).mockImplementation(() => ({
            market: { id: 1 }
          }));
        });

        it("show comapny name on search result", () => {
          const data = {
            accounts: {
              totalCount: 4,
              nodes: [
                ...adminTeamMembers,
                {
                  ...installerTeamMembers[0],
                  companyMembers: {
                    nodes: [
                      {
                        id: 2,
                        company: {
                          name: "A Company name"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          };
          wrapper.rerender(
            <Apollo>
              <I18nProvider>
                <CompanyMembersPage {...{ data }} />
              </I18nProvider>
            </Apollo>
          );
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: "A Company name" }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
          expect(
            within(wrapper.queryAllByTestId("list-item")[0]).getByText(
              "A Company name"
            )
          ).toBeTruthy();
        });

        it("result does not have company name", () => {
          const data = {
            accounts: {
              totalCount: 4,
              nodes: [
                ...adminTeamMembers,
                {
                  ...installerTeamMembers[0],
                  companyMembers: {
                    nodes: []
                  }
                }
              ]
            }
          };
          wrapper.rerender(
            <Apollo>
              <I18nProvider>
                <CompanyMembersPage {...{ data }} />
              </I18nProvider>
            </Apollo>
          );
          fireEvent.change(wrapper.container.querySelector("#filter"), {
            target: { value: installerTeamMembers[0].email }
          });
          expect(wrapper.queryAllByTestId("list-item")).toHaveLength(1);
          expect(wrapper.getByTestId("company-name")).toHaveTextContent("");
        });
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

    it("does not show certificationClass when cert is active", () => {
      const expiryDate = `${new Date().getFullYear() + 1}-1-1`;
      const data = {
        accounts: {
          totalCount: 1,
          nodes: [
            {
              ...installerTeamMembers[0],
              certificationsByDoceboUserId: {
                nodes: [
                  {
                    expiryDate,
                    name: "Certification name 2",
                    technology: "FLAT"
                  } as Certification
                ]
              }
            }
          ]
        }
      };
      wrapper.unmount();
      wrapper = render(
        <Apollo>
          <I18nProvider>
            <CompanyMembersPage {...{ data }} />
          </I18nProvider>
        </Apollo>
      );

      expect(screen.getByTestId("certification-0-icon")).not.toHaveClass(
        "expired"
      );
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

      it("should close dialog when click on cancel", () => {
        fireEvent.click(screen.getByTestId("footer-btn"));
        fireEvent.click(screen.getByTestId("invite-dialog-cancel"));

        expect(
          screen.queryByTestId("members-invitation-dialog")
        ).not.toBeInTheDocument();
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

        mockDelete.mockReturnValueOnce(mockDeleteOnCompleted());

        expect(mockDelete).toHaveBeenCalledWith({
          variables: { id: 2 }
        });
        expect(mockCompanyMembers).toHaveBeenCalledTimes(1);
        expect(mockCompanyMembers.mock.calls[0]).toEqual([
          {
            variables: {
              expiryDate: expect.any(Date)
            }
          }
        ]);
        expect(screen.getByText("memberRemoved")).toBeTruthy();
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

      it("show error message when fail to remove member", async () => {
        render(
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

        mockDelete.mockRejectedValueOnce(mockDeleteOnError());
        expect(mockDelete).toHaveBeenCalledWith({
          variables: { id: 2 }
        });
        expect(screen.getByText("genericError")).toBeTruthy();
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

        mockRoleAccountMutation.mockResolvedValueOnce(
          mockRoleAccountOnCompleted({ updateAccount: { account: { id: 1 } } })
        );

        expect(mockRoleAccountMutation).toHaveBeenCalledWith({
          variables: { input: { id: 1, patch: { role: "INSTALLER" } } }
        });
        expect(mockCompanyMembers).toHaveBeenCalledTimes(1);
        expect(mockRoterPush).toHaveBeenCalledWith([
          `/profile`,
          undefined,
          { shallow: false }
        ]);
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

      it("fail to update account with last_company_admin error", async () => {
        fireEvent.click(screen.getByTestId("change-role"));

        await waitFor(() => screen.getByText("user_card.confirm"));

        fireEvent.click(screen.getByText("user_card.confirm"));

        mockRoleAccountMutation.mockImplementationOnce(
          mockRoleAccountOnError({ message: "last_company_admin" })
        );

        expect(mockRoleAccountMutation).toHaveBeenCalledWith({
          variables: { input: { id: 1, patch: { role: "INSTALLER" } } }
        });
        expect(screen.getByText("lastCompanyAdminError")).toBeTruthy();
      });

      it("fail to update account with generic error", async () => {
        fireEvent.click(screen.getByTestId("change-role"));

        await waitFor(() => screen.getByText("user_card.confirm"));

        fireEvent.click(screen.getByText("user_card.confirm"));

        mockRoleAccountMutation.mockImplementationOnce(
          mockRoleAccountOnError({ message: "generic" })
        );

        expect(mockRoleAccountMutation).toHaveBeenCalledWith({
          variables: { input: { id: 1, patch: { role: "INSTALLER" } } }
        });
        expect(screen.getByText("genericError")).toBeTruthy();
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
        (useMarketContext as jest.Mock).mockImplementation(() => ({
          market: { id: 1 }
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

      it("execute user action button", async () => {
        (useAccountContext as jest.Mock).mockImplementation(() => ({
          account: { role: "SUPER_ADMIN" }
        }));
        (useMarketContext as jest.Mock).mockImplementation(() => ({
          market: { id: 1 }
        }));
        mockRoleAccountMutation.mockImplementationOnce(() =>
          mockRoleAccountOnError({ message: "generic??" })
        );

        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...props} />
            </I18nProvider>
          </Apollo>
        );
        const button = within(wrapper.container).getByTestId(
          "change-user-status"
        );

        fireEvent.click(button);

        expect(mockRoleAccountMutation).toHaveBeenCalledTimes(1);
        expect(mockRoleAccountOnError).toHaveBeenCalledTimes(1);
        await waitFor(() => screen.getByTestId("CloseButton"));
        const closeButton = screen.getByTestId("CloseButton");

        fireEvent.click(closeButton);
        expect(screen.queryByTestId("CloseButton")).not.toBeInTheDocument();
      });
    });

    describe("Refresh Member List and Details", () => {
      it("should update current member details if its details being opened", async () => {
        (useAccountContext as jest.Mock).mockImplementationOnce(() => ({
          account: adminTeamMembers
        }));
        mockRoleAccountMutation.mockImplementationOnce(() =>
          mockRoleAccountOnCompleted({
            updateAccount: {
              account: { ...adminTeamMembers[0] }
            }
          })
        );
        mockCompanyMembers.mockImplementationOnce(() =>
          mockCompanyMembersOnCompleted({
            accounts: {
              nodes: [
                {
                  ...adminTeamMembers[0],
                  role: "INSTALLER"
                }
              ]
            }
          })
        );
        fireEvent.click(screen.getByTestId("change-role"));
        await waitFor(() => screen.getByText("user_card.confirm"));

        fireEvent.click(screen.getByText("user_card.confirm"));

        expect(screen.getAllByText("roles.INSTALLER").length).toBe(2);
      });

      it("should update currentMember to first returned if newCurrent is not exist in the returned list after update", async () => {
        const data = {
          accounts: {
            totalCount: 1,
            nodes: [...installerTeamMembers, adminTeamMembers[0]]
          }
        };
        (useAccountContext as jest.Mock).mockImplementationOnce(() => ({
          account: installerTeamMembers
        }));
        mockDelete.mockImplementationOnce(() => mockDeleteOnCompleted());
        mockCompanyMembers.mockImplementationOnce(async () => {
          await Promise.resolve((r) => setTimeout(r, 1000));
          mockCompanyMembersOnCompleted({
            accounts: {
              nodes: [adminTeamMembers[0]]
            }
          });
        });
        wrapper.unmount();
        wrapper = render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...{ data }} />
            </I18nProvider>
          </Apollo>
        );
        const { getByText } = within(screen.getByTestId("user-card"));
        expect(
          getByText(
            `${installerTeamMembers[0].firstName} ${installerTeamMembers[0].lastName}`
          )
        ).toBeTruthy();
        fireEvent.click(screen.getByTestId("remove-member"));

        await waitFor(() => screen.getByText("user_card.confirm"));

        fireEvent.click(screen.getByText("user_card.confirm"));

        await waitFor(() => screen.getByText("memberRemoved"));

        const newUserCard = within(screen.getByTestId("user-card"));
        expect(
          newUserCard.getByText(
            `${adminTeamMembers[0].firstName} ${adminTeamMembers[0].lastName}`
          )
        ).toBeTruthy();
      });
    });

    describe("Project Table", () => {
      it("should show project when user is a member of a project", async () => {
        const data = {
          accounts: {
            totalCount: 1,
            nodes: [
              {
                ...installerTeamMembers[0],
                projectMembers: {
                  nodes: [
                    {
                      project: {
                        ...projectFactory(),
                        id: 1,
                        name: "test-project-1",
                        hidden: false
                      }
                    }
                  ]
                }
              }
            ]
          }
        };

        expect(screen.queryByTestId("project-table")).toBeFalsy();
        wrapper.unmount();
        render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...{ data }} />
            </I18nProvider>
          </Apollo>
        );
        await waitFor(() => {
          expect(screen.getByTestId("project-table")).toBeTruthy();
          expect(screen.queryByText("test-project-1")).toBeTruthy();
          const table = screen.queryByTestId("project-table-row-0");
          expect(table.childElementCount).toBe(4);
          expect(screen.queryByTestId("project-link-1")).toHaveAttribute(
            "href",
            "projects/1"
          );
        });
      });

      it("should hide hidden project", async () => {
        const data = {
          accounts: {
            totalCount: 1,
            nodes: [
              {
                ...installerTeamMembers[0],
                projectMembers: {
                  nodes: [
                    {
                      project: {
                        ...projectFactory(),
                        name: "test-project-1",
                        hidden: false
                      }
                    }
                  ]
                }
              },
              {
                ...installerTeamMembers[0],
                projectMembers: {
                  nodes: [
                    {
                      project: {
                        ...projectFactory(),
                        name: "test-project-2",
                        hidden: false
                      }
                    }
                  ]
                }
              }
            ]
          }
        };
        wrapper.unmount();
        render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...{ data }} />
            </I18nProvider>
          </Apollo>
        );
        await waitFor(() => {
          expect(screen.getByTestId("project-table")).toBeTruthy();
          expect(screen.queryByText("test-project-2")).toBeFalsy();
        });
      });

      it("shouldn't show table if no projects", async () => {
        const data = {
          accounts: {
            totalCount: 1,
            nodes: [
              {
                ...installerTeamMembers[0],
                projectMembers: {
                  nodes: []
                }
              }
            ]
          }
        };
        wrapper.unmount();
        render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...{ data }} />
            </I18nProvider>
          </Apollo>
        );
        await waitFor(() => {
          expect(screen.queryByTestId("project-table")).toBeFalsy();
        });
      });

      it("show mobile action card", async () => {
        mockMediaQuery.mockReturnValue(true);
        (useAccountContext as jest.Mock).mockImplementation(() => ({
          account: { role: "SUPER_ADMIN" }
        }));
        (useMarketContext as jest.Mock).mockImplementation(() => ({
          market: { id: 1 }
        }));
        wrapper.unmount();
        render(
          <Apollo>
            <I18nProvider>
              <CompanyMembersPage {...props} />
            </I18nProvider>
          </Apollo>
        );

        await waitFor(() => {
          expect(
            screen.queryByTestId("company-member-action-card-mobile")
          ).toBeTruthy();
        });
      });
    });
  });
});
