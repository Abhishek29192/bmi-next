import React, { useState } from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import {
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof
} from "@bmi/icon";
import { SvgIcon } from "@material-ui/core";
import { Technology } from "@bmi/intouch-api-types";
import { SidePanel } from "../../../components/SidePanel";
import { FilterResult } from "../../../components/FilterResult";
import { CompanyMembersQuery } from "../../../graphql/generated/operations";
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

const CompanyMembers = ({ data }: PageProps) => {
  const { t } = useTranslation("common");
  const [members, setMembers] = useState(data.companyMembers.nodes);

  const onSearch = (value) => {
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

  return (
    <SidePanel
      filters={null}
      searchLabel={t("Search for a user")}
      onSearchFilterChange={onSearch}
      noResultLabel={t("Member not found")}
    >
      {members.map(
        ({
          account: {
            id,
            firstName,
            lastName,
            role,
            certificationsByDoceboUserId
          }
        }) => {
          const tecnologies = new Set(
            certificationsByDoceboUserId.nodes.map((item) => item.technology)
          );

          return (
            <FilterResult
              testId="list-item"
              label={`${firstName} ${lastName}`}
              key={id}
              onClick={() => {}}
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
        }
      )}
    </SidePanel>
  );
};

export default CompanyMembers;
