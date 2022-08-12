import { gql } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Typography } from "@bmi/components";
import { Button } from "@bmi/components";
import { useTranslation } from "next-i18next";
import {
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof,
  Grid,
  Icon,
  FlatRoof,
  PitchedRoof,
  AnchorLink
} from "@bmi/components";
import { SvgIcon } from "@material-ui/core";
import {
  Technology,
  Role,
  Account,
  AccountStatus
} from "@bmi/intouch-api-types";
import classnames from "classnames";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { SidePanel } from "../../../SidePanel";
import { FilterResult } from "../../../FilterResult";
import { sortByFirstName } from "../../../../lib/utils/account";
import { TeamMembersQuery } from "../../../../graphql/generated/operations";
import { useUpdateRoleAccountMutation } from "../../../../graphql/generated/hooks";
import { TableContainer } from "../../../TableContainer";
import { DefaultTable } from "../../../Tables";
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

const TECHNOLOGY_ICONS: Record<
  Exclude<Technology, "OTHER">,
  React.SFC<React.SVGProps<SVGSVGElement>>
> = {
  FLAT: FlatRoof,
  PITCHED: PitchedRoof
};

const today = new Date(new Date().setUTCHours(0, 0, 0, 0));

const getTechnologies = (account) =>
  Array.from(
    new Set(
      account.certificationsByDoceboUserId.nodes.map((item) => item.technology)
    )
  );

const certificationClass = (data: string): boolean => {
  const certDate: Date = new Date(new Date(data).setUTCHours(0, 0, 0, 0));
  return certDate < today;
};

const getValidCertDate = () => {
  const expiryDate = new Date();
  expiryDate.setHours(0, 0, 0, 0);
  expiryDate.setMonth(expiryDate.getMonth() - 6);
  return expiryDate;
};

const getValidProjects = (currentMember) => {
  return currentMember
    ? currentMember.projectMembers.nodes.filter(
        ({ project }) =>
          !!project &&
          project.hidden === false &&
          new Date(project.endDate) > new Date()
      )
    : [];
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
  const [projects, setProjects] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
      setProjects(getValidProjects(currentMember));
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

  useEffect(() => {
    setProjects(getValidProjects(currentMember));
  }, [currentMember]);

  return (
    <>
      <Alert messages={messages} onClose={() => setMessages([])} />
      <div
        className={classnames(
          layoutStyles.sidePanelWrapper,
          styles.companyMemberPage
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
        <div className={styles.detail}>
          <Grid container className={styles.userDetail}>
            <Grid className={styles.item} item xs={12} lg={8}>
              <TableContainer
                title={t("team-page:table.title")}
                testid="certification-table"
                noResultsText={t("team-page:table.noResults")}
              >
                {currentMember?.certificationsByDoceboUserId.nodes.length && (
                  <DefaultTable
                    tableReference="certification"
                    items={currentMember?.certificationsByDoceboUserId.nodes.map(
                      ({ name, technology, expiryDate }, index) => ({
                        [t("team-page:table.type")]: (
                          <span
                            className={classnames({
                              expired: certificationClass(expiryDate)
                            })}
                            data-testid={`certification-${index}-icon`}
                          >
                            <SvgIcon
                              key={`${index}-${technology}`}
                              viewBox="0 0 48 48"
                              className={styles.icon}
                              component={CERTIFICATION_ICONS[`${technology}`]}
                              data-testid={`icon-${technology}`}
                            />
                          </span>
                        ),
                        [t("team-page:table.certification")]: name,
                        [t("team-page:table.validity")]: formatDate(expiryDate)
                      })
                    )}
                    enablePagination={false}
                  />
                )}
              </TableContainer>
              {!!projects.length && (
                <TableContainer
                  title={t("team-page:projectTable.title")}
                  testid="project-table"
                  noResultsText={t("team-page:table.noResults")}
                  className={styles.projectTable}
                >
                  <DefaultTable
                    tableReference="project"
                    items={projects.map(
                      ({
                        project: { id, technology, name, startDate, endDate }
                      }) => ({
                        [t("team-page:projectTable.type")]: (
                          <Icon
                            source={TECHNOLOGY_ICONS[`${technology}`]}
                            style={{ width: 20, height: 17 }}
                          />
                        ),
                        [t("team-page:projectTable.project")]: (
                          <AnchorLink
                            action={{ href: `projects/${id}` }}
                            data-testid={`project-link-${id}`}
                          >
                            {name}
                          </AnchorLink>
                        ),
                        [t("team-page:projectTable.startDate")]:
                          formatDate(startDate),
                        [t("team-page:projectTable.endDate")]:
                          formatDate(endDate)
                      })
                    )}
                    enablePagination={true}
                    count={10}
                  />
                </TableContainer>
              )}
            </Grid>
            <Grid className={styles.item} item xs={12} lg={4}>
              <Grid item xs={12}>
                <div className={styles.userCard}>
                  <UserCard
                    testid="user-card"
                    onAccountUpdate={onAccountUpdate}
                    onRemoveUser={onRemoveUser}
                    account={currentMember as Account}
                    companyName={
                      findAccountCompany(currentMember as Account)?.name
                    }
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
                </div>
              </Grid>
              {!isMobile && (
                <AccessControl dataModel="company" action="changeStatus">
                  <Grid
                    item
                    xs={12}
                    style={{ marginTop: 30 }}
                    className={classnames(styles.actionPanel)}
                  >
                    <CompanyMemberActionCard
                      member={currentMember}
                      onAccountUpdate={onAccountChangeStatus}
                      disabled={isMemberActionDisabled}
                    />
                  </Grid>
                </AccessControl>
              )}
            </Grid>
          </Grid>
          {isMobile && (
            <AccessControl dataModel="company" action="changeStatus">
              <div
                className={classnames(styles.actionPanel)}
                data-testid="company-member-action-card-mobile"
              >
                <CompanyMemberActionCard
                  member={currentMember}
                  onAccountUpdate={onAccountChangeStatus}
                  disabled={isMemberActionDisabled}
                />
              </div>
            </AccessControl>
          )}
        </div>
      </div>
      <InvitationDialog
        styles={styles}
        dialogOpen={dialogOpen}
        onCloseClick={() => setDialogOpen(false)}
      />
    </>
  );
};

export default CompanyMembers;
