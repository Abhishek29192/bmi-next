import React, { useState } from "react";
import Typography from "@bmi/typography";
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
import { CompanyMembersQuery } from "../../../../graphql/generated/operations";

import { TableContainer } from "../../../TableContainer";
import { UserCard } from "../../../UserCard";
import InvitationDialog from "./Dialog";
import styles from "./styles.module.scss";

const CERTIFICATION_ICONS: {
  [K in Technology]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: CertificationPitchedRoof,
  PITCHED: CertificationFlatRoof,
  OTHER: CertificationOtherTraining
};

export type PageProps = {
  data: CompanyMembersQuery;
  error?: {
    message: string;
  };
};

const today = new Date(new Date().setUTCHours(0, 0, 0, 0));

const certificationClass = (data: string): string => {
  const certDate: Date = new Date(new Date(data).setUTCHours(0, 0, 0, 0));
  return certDate < today ? styles.expired : "";
};

const CompanyMembers = ({ data }: PageProps) => {
  const { t } = useTranslation("team-page");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [members, setMembers] = useState(data.companyMembers.nodes);
  const [currentMember, setCurrentMember] = useState<Partial<CompanyMember>>(
    data?.companyMembers?.nodes?.[0] as CompanyMember
  );

  const onSearch = (value: string): void => {
    const valueToSearch = value.toLowerCase();
    setMembers([
      ...data.companyMembers.nodes.filter(
        ({ account: { email = "", firstName = "", lastName = "" } }) =>
          email.toLowerCase().indexOf(valueToSearch) !== -1 ||
          firstName.toLowerCase().indexOf(valueToSearch) !== -1 ||
          lastName.toLowerCase().indexOf(valueToSearch) !== -1
      )
    ]);
  };

  const formattedRole = (role: Role) => role?.replace("_", " ")?.toLowerCase();

  return (
    <div className={styles.companyPage}>
      <SidePanel
        filters={null}
        searchLabel={t("sidePanel.search.label")}
        onSearchFilterChange={onSearch}
        noResultLabel={t("sidePanel.search.noResult")}
        footerBtn={{
          label: t("sidePanel.inviteLabel"),
          onClick: () => setDialogOpen(true)
        }}
      >
        {members?.map(({ account, ...rest }) => {
          const { id, role, lastName, firstName } = account;
          const tecnologies = Array.from(
            new Set(
              account.certificationsByDoceboUserId.nodes.map(
                (item) => item.technology
              )
            )
          );

          return (
            <FilterResult
              testId="list-item"
              label={`${firstName} ${lastName}`}
              key={id}
              onClick={() =>
                setCurrentMember({ account, ...rest } as Partial<CompanyMember>)
              }
            >
              <Typography
                style={{ textTransform: "capitalize" }}
                variant="subtitle1"
                color="textSecondary"
              >
                {formattedRole(role)}
              </Typography>
              <div className={styles.icons}>
                {tecnologies.map((technology, index) => (
                  <SvgIcon
                    key={`${id}-${index}-${technology}`}
                    viewBox="0 0 48 48"
                    className={styles.icon}
                    component={CERTIFICATION_ICONS[technology as Technology]}
                    data-testid={`icon-${technology}`}
                  />
                ))}
              </div>
            </FilterResult>
          );
        })}
      </SidePanel>
      <ThreeColumnGrid>
        <div className={styles.detail}>
          <TableContainer title={t("table.title")} testid="certification-table">
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
                        className={certificationClass(certification.expiryDate)}
                      >
                        <Table.Cell>
                          <SvgIcon
                            key={`${index}-${certification.technology}`}
                            viewBox="0 0 48 48"
                            className={styles.icon}
                            component={
                              CERTIFICATION_ICONS[
                                certification.technology as Technology
                              ]
                            }
                            data-testid={`icon-${certification.technology}`}
                          />
                        </Table.Cell>
                        <Table.Cell>{certification.name}</Table.Cell>
                        <Table.Cell>
                          {new Intl.DateTimeFormat("en-GB", {
                            dateStyle: "medium"
                          } as any).format(
                            new Date(certification.expiryDate?.substring(0, 10))
                          )}
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
          username={`${currentMember?.account?.firstName} ${currentMember?.account?.lastName}`}
          role={currentMember?.account?.role?.replace("_", " ")?.toLowerCase()}
          avatar={currentMember?.account.photo}
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
  );
};

export default CompanyMembers;
