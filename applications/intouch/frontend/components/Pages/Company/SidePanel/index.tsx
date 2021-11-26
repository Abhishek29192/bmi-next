import React, { useState, useMemo } from "react";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { SvgIcon } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { GetCompaniesByMarketQuery } from "../../../../graphql/generated/operations";
import { CompanyReport } from "../../../Reports";
import { FilterResult } from "../../../FilterResult";
import { SidePanel } from "../../../SidePanel";
import AccessControl from "../../../../lib/permissions/AccessControl";

type CompaniesSidePanelProps = {
  companies: GetCompaniesByMarketQuery["companies"]["nodes"];
  onItemSelected?: (itemId: number) => void;
  selectedItemId?: number;
};

// TODO: refactor Filter to be more generic & re-used across projects, companies, team, etc.

export const CompaniesSidePanel = ({
  companies,
  onItemSelected
}: CompaniesSidePanelProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    return companies.filter(({ name }) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = (name || "").toLowerCase().includes(query);
      return matchesQuery;
    });
  }, [companies, searchQuery]);

  return (
    <SidePanel
      searchLabel={t("company-page:search.inputLabel")}
      onSearchFilterChange={(query: string) => {
        setSearchQuery(query);
      }}
      renderFooter={() => (
        <AccessControl dataModel="company" action="downloadReport">
          <CompanyReport disabled={companies?.length === 0} />
        </AccessControl>
      )}
    >
      {filteredCompanies.map(({ id, name, isProfileComplete }) => (
        <FilterResult
          label={name}
          key={id}
          onClick={() => {
            onItemSelected && onItemSelected(id);
          }}
        >
          <Typography style={{ display: "flex" }}>
            {isProfileComplete && (
              <SvgIcon component={CheckIcon} style={{ color: "#009a44" }} />
            )}
            {isProfileComplete
              ? t("company-page:search.profileComplete")
              : t("company-page:search.profileIncomplete")}
          </Typography>
        </FilterResult>
      ))}
    </SidePanel>
  );
};
