import { gql } from "@apollo/client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Typography } from "@bmi/components";
import { Button } from "@bmi/components";
import { useTranslation } from "next-i18next";
import {
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof
} from "@bmi/components";
import { Table } from "@bmi/components";
import { SvgIcon } from "@material-ui/core";
import {
  Technology,
  Role,
  Account,
  AccountStatus
} from "@bmi/intouch-api-types";
import classnames from "classnames";
import { ThreeColumnGrid } from "../../../ThreeColumnGrid";
import { SidePanel } from "../../../SidePanel";
import { FilterResult } from "../../../FilterResult";
import { sortByFirstName } from "../../../../lib/utils/account";
import { TeamMembersQuery } from "../../../../graphql/generated/operations";
import { useUpdateRoleAccountMutation } from "../../../../graphql/generated/hooks";
import { TableContainer } from "../../../TableContainer";
import { UserCard } from "../../../UserCard";
import {
  useDeleteCompanyMemberMutation,
  useTeamMembersLazyQuery
} from "../../../../graphql/generated/hooks";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { formatDate } from "../../../../lib/utils";
import { useAccountContext } from "../../../../context/AccountContext";
import {
  findAccountCompany,
  isSuperOrMarketAdmin
} from "../../../../lib/account";
import layoutStyles from "../../../Layout/styles.module.scss";
import { TeamReport } from "../../../Reports";
import InvitationDialog from "./Dialog";
import styles from "./styles.module.scss";
import Alert from "./Alert";
import CompanyMemberActionCard from "./Action";

export const REMOVE_MEMBER = gql`
  mutation deleteCompanyMember($id: Int!) {
    deleteCompanyMember(input: { id: $id }) {
      clientMutationId
    }
  }
`;

export type PageProps = {
  data: TeamMembersQuery;
  error?: {
    message: string;
  };
};

export type MessageProp = {
  severity: "error" | "warning" | "info" | "success";
  message: string;
};

const CERTIFICATION_ICONS: {
  [K in Technology]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: CertificationFlatRoof,
  PITCHED: CertificationPitchedRoof,
  OTHER: CertificationOtherTraining
};

const today = new Date(new Date().setUTCHours(0, 0, 0, 0));

const getTechnologies = (account) =>
  Array.from(
    new Set(
      account.certificationsByDoceboUserId.nodes.map((item) => item.technology)
    )
  );

const certificationClass = (data: string): string => {
  const certDate: Date = new Date(new Date(data).setUTCHours(0, 0, 0, 0));
  return certDate < today ? styles.expired : "";
};

const getValidCertDate = () => {
  const expiryDate = new Date();
  expiryDate.setHours(0, 0, 0, 0);
  expiryDate.setMonth(expiryDate.getMonth() - 6);
  return expiryDate;
};

const CompanyMembers = ({ data }: PageProps) => {
  const { t } = useTranslation(["common", "team-page"]);

  const { account } = useAccountContext();
  const router = useRouter();

  const isPowerfulUser = isSuperOrMarketAdmin(account);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [messages, setMessages] = useState<MessageProp[]>([]);
  const [members, setMembers] = useState(data.accounts.nodes);
  const [currentMember, setCurrentMember] = useState<
    TeamMembersQuery["accounts"]["nodes"][0]
  >(data.accounts.nodes[0]);

  const [isMemberActionDisabled, setMemberActionDisabled] = useState(false);

  const [deleteMember] = useDeleteCompanyMemberMutation({
    onError: (error) => {
      setMessages([
        {
          severity: "error",
          message: "genericError"
        }
      ]);
      closeWithDelay();
    },
    onCompleted: () => {
      setCurrentMember(null);

      const expiryDate = getValidCertDate();

      fetchCompanyMembers({
        variables: {
          expiryDate
        }
      });

      setMessages([
        {
          severity: "success",
          message: "memberRemoved"
        }
      ]);

      closeWithDelay();
    }
  });

  const closeWithDelay = () => {
    setTimeout(() => {
      setDialogOpen(false);
    }, 2000);
  };

  const [fetchCompanyMembers] = useTeamMembersLazyQuery({
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (currentMember) {
        const newCurrent = data.accounts.nodes.find(
          ({ id }) => id === currentMember.id
        );
        setCurrentMember(newCurrent);
      } else {
        setCurrentMember(data.accounts.nodes[0]);
      }

      setMembers(sortByFirstName(data.accounts.nodes));
      setMemberActionDisabled(false);
    }
  });

  const onRemoveUser = async () => {
    const selectedUser = members.find(
      (member) => member.id === currentMember.id
    );

    // Deleting the current user
    deleteMember({
      variables: {
        id: selectedUser.companyMembers.nodes[0].id
      }
    });
  };

  const [updateAccount] = useUpdateRoleAccountMutation({
    onError: ({ message: graphqlError }) => {
      setMemberActionDisabled(false);
      const message =
        graphqlError === "last_company_admin"
          ? "lastCompanyAdminError"
          : "genericError";
      setMessages([
        {
          severity: "error",
          message
        }
      ]);
    },
    onCompleted: ({ updateAccount }) => {
      //if a user changes his/her role we should redirect
      if (account.id === updateAccount.account.id) {
        router.push(`/profile`, undefined, { shallow: false });
      }

      const expiryDate = getValidCertDate();

      fetchCompanyMembers({
        variables: {
          expiryDate
        }
      });
    }
  });

  const onAccountUpdate = (id: number, role: Role) =>
    updateAccount({
      variables: {
        input: {
          id,
          patch: {
            role
          }
        }
      }
    });

  const onSearch = (value: string): void => {
    const query = value.toLowerCase().trim();

    const membersResult = [...data.accounts.nodes].filter((account) => {
      const { email = "", firstName = "", lastName = "" } = account;
      const companyName = findAccountCompany(account as Account)?.name;

      const defaultFilterData = [email, firstName, lastName];
      const data = !isPowerfulUser
        ? defaultFilterData
        : [...defaultFilterData, companyName];

      return data.filter(Boolean).join(" ").toLowerCase().includes(query);
    });

    setMembers(membersResult);
  };
  const onAccountChangeStatus = async (id: number, status: AccountStatus) => {
    setMemberActionDisabled(true);
    updateAccount({
      variables: {
        input: {
          id,
          patch: {
            status
          }
        }
      }
    });
  };
  return (
    <>
      <Alert messages={messages} onClose={() => setMessages([])} />
      <div
        className={classnames(
          layoutStyles.sidePanelWrapper,
          styles.companyPage
        )}
      >
        <SidePanel
          filters={null}
          searchLabel={t("team-page:sidePanel.search.label")}
          onSearchFilterChange={onSearch}
          noResultLabel={t("team-page:sidePanel.search.noResult")}
          renderFooter={() => (
            <>
              <AccessControl dataModel="company" action="inviteUser">
                <Button
                  variant="outlined"
                  onClick={() => setDialogOpen(true)}
                  data-testid="footer-btn"
                  className={styles.sidePanelFooterButton}
                >
                  {t("team-page:sidePanel.inviteLabel")}
                </Button>
              </AccessControl>
              <AccessControl dataModel="company" action="downloadReport">
                <TeamReport disabled={members.length === 0} />
              </AccessControl>
            </>
          )}
        >
          {members.map((member) => (
            <FilterResult
              testId="list-item"
              label={`${member.firstName} ${member.lastName}`}
              key={member.id}
              onClick={() => setCurrentMember(member as Account)}
            >
              <Typography
                style={{ textTransform: "capitalize" }}
                variant="subtitle1"
                color="textSecondary"
              >
                {t(`common:roles.${member.role}`)}
              </Typography>
              {isPowerfulUser && (
                <Typography
                  variant="subtitle1"
                  color="textPrimary"
                  data-testid="company-name"
                >
                  {member.companyMembers.nodes[0]?.company.name}
                </Typography>
              )}
              <div className={styles.icons}>
                {getTechnologies(member).map((technology, index) => (
                  <SvgIcon
                    key={`${account.id}-${index}-${technology}`}
                    viewBox="0 0 48 48"
                    className={styles.icon}
                    component={CERTIFICATION_ICONS[technology as Technology]}
                    data-testid={`icon-${technology}`}
                  />
                ))}
              </div>
            </FilterResult>
          ))}
        </SidePanel>
        <ThreeColumnGrid>
          <div className={styles.detail}>
            <TableContainer
              title={t("team-page:table.title")}
              testid="certification-table"
              noResultsText={t("team-page:table.noResults")}
            >
              {currentMember?.certificationsByDoceboUserId.nodes.length && (
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>{t("team-page:table.type")}</Table.Cell>
                      <Table.Cell>
                        {t("team-page:table.certification")}
                      </Table.Cell>
                      <Table.Cell>{t("team-page:table.validity")}</Table.Cell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {currentMember.certificationsByDoceboUserId.nodes.map(
                      (certification, index) => (
                        <Table.Row
                          key={`certification-${index}-${certification.id}`}
                          className={certificationClass(
                            certification.expiryDate
                          )}
                          data-testid={`certification-${index}-${certification.id}`}
                        >
                          <Table.Cell>
                            <SvgIcon
                              key={`${index}-${certification.technology}`}
                              viewBox="0 0 48 48"
                              className={styles.icon}
                              component={
                                CERTIFICATION_ICONS[certification.technology]
                              }
                              data-testid={`icon-${certification.technology}`}
                            />
                          </Table.Cell>
                          <Table.Cell>{certification.name}</Table.Cell>
                          <Table.Cell>
                            {formatDate(certification.expiryDate)}
                          </Table.Cell>
                        </Table.Row>
                      )
                    )}
                  </Table.Body>
                </Table>
              )}
            </TableContainer>
          </div>
          <UserCard
            testid="user-card"
            onAccountUpdate={onAccountUpdate}
            onRemoveUser={onRemoveUser}
            account={currentMember as Account}
            companyName={findAccountCompany(currentMember as Account)?.name}
            details={[
              {
                type: "phone",
                text: currentMember?.phone,
                action: {
                  model: "htmlLink",
                  href: `tel:${currentMember?.phone}`
                },
                label: t("common:telephone")
              },
              {
                type: "email",
                text: currentMember?.email,
                action: {
                  model: "htmlLink",
                  href: `mailto:${currentMember?.email}`
                },
                label: t("common:email")
              }
            ]}
          />
          <div style={{ flexBasis: "100%" }}>
            <AccessControl dataModel="company" action="changeStatus">
              <CompanyMemberActionCard
                member={currentMember}
                onAccountUpdate={onAccountChangeStatus}
                disabled={isMemberActionDisabled}
              />
            </AccessControl>
          </div>
        </ThreeColumnGrid>
        <InvitationDialog
          styles={styles}
          dialogOpen={dialogOpen}
          onCloseClick={() => setDialogOpen(false)}
        />
      </div>
    </>
  );
};

export default CompanyMembers;
