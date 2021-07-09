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
import { Technology, CompanyMember } from "@bmi/intouch-api-types";
import { ThreeColumnGrid } from "../../ThreeColumnGrid";
import { SidePanel } from "../../SidePanel";
import { FilterResult } from "../../FilterResult";
import { CompanyMembersQuery } from "../../../graphql/generated/operations";
import { TableContainer } from "../../TableContainer";
import { UserCard } from "../../UserCard";

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

const CompanyMembers = ({ data }: PageProps) => {
  const { t } = useTranslation("common");
  const [currentMember, setCurrentMember] = useState<Partial<CompanyMember>>(
    data?.companyMembers?.nodes?.[0] as CompanyMember
  );

  const [members, setMembers] = useState(data.companyMembers.nodes);

  const onSearch = (value: string): void => {
    const valueToSearch = value.toLowerCase();
    setMembers([
      ...data.companyMembers.nodes.filter(
        ({ account: { email, firstName, lastName } }) =>
          email?.toLowerCase()?.indexOf(valueToSearch) !== -1 ||
          firstName?.toLowerCase()?.indexOf(valueToSearch) !== -1 ||
          lastName?.toLowerCase()?.indexOf(valueToSearch) !== -1
      )
    ]);
  };

  const isCertificationExpired = (data: string): boolean => {
    const certDate: Date = new Date(new Date(data).setUTCHours(0, 0, 0, 0));

    return certDate < today;
  };

  return (
    <div className={styles.companyPage}>
      <SidePanel
        filters={null}
        searchLabel={t("Search for a user")}
        onSearchFilterChange={onSearch}
        noResultLabel={t("Member not found")}
      >
        {members.map(({ account, ...rest }) => {
          const {
            id,
            role,
            lastName,
            firstName,
            certificationsByDoceboUserId
          } = account;
          const tecnologies = new Set(
            certificationsByDoceboUserId.nodes.map((item) => item.technology)
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
                {role?.replace("_", " ")?.toLowerCase()}
              </Typography>
              <div className={styles.icons}>
                {Array.from(tecnologies).map((technology, index) => (
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
          <TableContainer title="Certification(s)" testid="certification-table">
            {currentMember?.account?.certificationsByDoceboUserId?.nodes
              .length && (
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell>{t("Type")}</Table.Cell>
                    <Table.Cell>{t("Certification")}</Table.Cell>
                    <Table.Cell>{t("Validity")}</Table.Cell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {currentMember?.account.certificationsByDoceboUserId.nodes.map(
                    (certification, index) => (
                      <Table.Row
                        key={`certification-${index}-${certification.id}`}
                        className={
                          isCertificationExpired(certification.expiryDate)
                            ? styles.expired
                            : ""
                        }
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
              label: "Telephone"
            },
            {
              type: "email",
              text: currentMember?.account.email,
              action: {
                model: "htmlLink",
                href: `mailto:${currentMember?.account.email}`
              },
              label: "Email"
            }
          ]}
        />
      </ThreeColumnGrid>
    </div>
  );
};

export default CompanyMembers;
