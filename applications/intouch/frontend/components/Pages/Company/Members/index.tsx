import { gql } from "@apollo/client";
import React, { useState } from "react";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import {
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof
} from "@bmi/icon";
import Table from "@bmi/table";
import { SvgIcon } from "@material-ui/core";
import { Technology, CompanyMember, Role } from "@bmi/intouch-api-types";
import { ThreeColumnGrid } from "../../../ThreeColumnGrid";
import { SidePanel } from "../../../SidePanel";
import { FilterResult } from "../../../FilterResult";
import { reorderMembers } from "../../../../lib/utils/companyMembers";
import { CompanyMembersQuery } from "../../../../graphql/generated/operations";
import { useUpdateRoleAccountMutation } from "../../../../graphql/generated/hooks";
import { TableContainer } from "../../../TableContainer";
import { UserCard } from "../../../UserCard";
import {
  useDeleteCompanyMemberMutation,
  useCompanyMembersLazyQuery
} from "../../../../graphql/generated/hooks";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { formatDate } from "../../../../lib/utils";
import InvitationDialog from "./Dialog";
import styles from "./styles.module.scss";
import Alert from "./Alert";

export const REMOVE_MEMBER = gql`
  mutation deleteCompanyMember($id: Int!) {
    deleteCompanyMember(input: { id: $id }) {
      clientMutationId
    }
  }
`;

export type PageProps = {
  data: CompanyMembersQuery;
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
  FLAT: CertificationPitchedRoof,
  PITCHED: CertificationFlatRoof,
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
  const { t } = useTranslation("team-page");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [messages, setMessages] = useState<MessageProp[]>([]);
  const [members, setMembers] = useState(data.companyMembers.nodes);
  const [currentMember, setCurrentMember] = useState<Partial<CompanyMember>>(
    data?.companyMembers?.nodes?.[0] as CompanyMember
  );

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

  const [fetchCompanyMembers] = useCompanyMembersLazyQuery({
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const newCurrent = data?.companyMembers?.nodes.find(
        ({ id }) => id === currentMember.id
      ) as Partial<CompanyMember>;

      setMembers(reorderMembers(data?.companyMembers?.nodes));

      setCurrentMember(newCurrent);
    }
  });

  const onRemoveUser = async () =>
    deleteMember({
      variables: {
        id: currentMember.id
      }
    });

  const [updateAccount] = useUpdateRoleAccountMutation({
    onError: (error) => {
      setMessages([
        {
          severity: "error",
          message: "genericError"
        }
      ]);
    },
    onCompleted: () => {
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
    const valueToSearch = value.toLowerCase();
    setMembers([
      ...data.companyMembers.nodes.filter(
        ({ account: { email = "", firstName = "", lastName = "" } }) =>
          (email && email.toLowerCase().indexOf(valueToSearch) !== -1) ||
          (firstName &&
            firstName.toLowerCase().indexOf(valueToSearch) !== -1) ||
          (lastName && lastName.toLowerCase().indexOf(valueToSearch) !== -1)
      )
    ]);
  };

  return (
    <>
      <Alert messages={messages} onClose={() => setMessages([])} />
      <div className={styles.companyPage}>
        <SidePanel
          filters={null}
          searchLabel={t("sidePanel.search.label")}
          onSearchFilterChange={onSearch}
          noResultLabel={t("sidePanel.search.noResult")}
          renderFooter={() => (
            <AccessControl dataModel="company" action="inviteUser">
              <Button
                variant="outlined"
                onClick={() => setDialogOpen(true)}
                data-testid="footer-btn"
                className={styles.sidePanelFooterButton}
              >
                {t("sidePanel.inviteLabel")}
              </Button>
            </AccessControl>
          )}
        >
          {members.map(({ account, ...rest }) => (
            <FilterResult
              testId="list-item"
              label={`${account.firstName} ${account.lastName}`}
              key={account.id}
              onClick={() =>
                setCurrentMember({
                  account,
                  ...rest
                } as Partial<CompanyMember>)
              }
            >
              <Typography
                style={{ textTransform: "capitalize" }}
                variant="subtitle1"
                color="textSecondary"
              >
                {account.formattedRole}
              </Typography>
              <div className={styles.icons}>
                {getTechnologies(account).map((technology, index) => (
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
              title={t("table.title")}
              testid="certification-table"
            >
              {currentMember?.account?.certificationsByDoceboUserId?.nodes
                .length && (
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>{t("table.type")}</Table.Cell>
                      <Table.Cell>{t("table.certification")}</Table.Cell>
                      <Table.Cell>{t("table.validity")}</Table.Cell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {currentMember?.account.certificationsByDoceboUserId.nodes.map(
                      (certification, index) => (
                        <Table.Row
                          key={`certification-${index}-${certification.id}`}
                          className={certificationClass(
                            certification.expiryDate
                          )}
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
            account={currentMember?.account}
            companyName={currentMember?.company.name}
            details={[
              {
                type: "phone",
                text: currentMember?.account.phone,
                action: {
                  model: "htmlLink",
                  href: `tel:${currentMember?.account.phone}`
                },
                label: t("common:telephone")
              },
              {
                type: "email",
                text: currentMember?.account.email,
                action: {
                  model: "htmlLink",
                  href: `mailto:${currentMember?.account.email}`
                },
                label: t("common:email")
              }
            ]}
          />
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
