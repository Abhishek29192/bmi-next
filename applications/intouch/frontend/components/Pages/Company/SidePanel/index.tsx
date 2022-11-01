import { Typography } from "@bmi-digital/components";
import { SvgIcon } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import { GetCompaniesByMarketQuery } from "../../../../graphql/generated/operations";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { FilterResult } from "../../../FilterResult";
import { CompanyReport } from "../../../Reports";
import { SidePanel } from "../../../SidePanel";

type CompaniesSidePanelProps = {
  companies: GetCompaniesByMarketQuery["companies"]["nodes"];
  onItemSelected?: (itemId: number) => void;
  selectedItemId?: number;
};

// TODO: refactor Filter to be more generic & re-used across projects, companies, team, etc.
const INITIAL_ORDER_SELECTION = "ALPHABETICAL";
const getCompaniesOrders = (t) => {
  return [
    {
      label: t("company-page:order.labels.ALPHABETICAL"),
      attr: "ALPHABETICAL"
    },
    { label: t("company-page:order.labels.UPDATED"), attr: "UPDATED" }
  ];
};

export const CompaniesSidePanel = ({
  companies,
  onItemSelected,
  selectedItemId
}: CompaniesSidePanelProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  const [orderSelection, setOrderSelection] = useState<string>(
    INITIAL_ORDER_SELECTION
  );

  const handleOrderChange = ({ attr }) => {
    setOrderSelection(attr);
  };

  const companyOrders = useMemo(() => getCompaniesOrders(t), [t]);
  const orderOptions = useMemo(() => {
    return companyOrders.map((filter) => ({
      ...filter,
      isActive: filter.attr === orderSelection
    }));
  }, [companyOrders, orderSelection]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    return companies
      .filter(({ name }) => {
        const query = searchQuery.toLowerCase().trim();
        return (name || "").toLowerCase().includes(query);
      })
      .sort((a, b) => {
        if (orderSelection === "UPDATED") {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        if (!b.name || !a.name) {
          return b.name ? 1 : a.name ? -1 : 0;
        }
        return a.name.localeCompare(b.name);
      });
  }, [companies, searchQuery, orderSelection]);

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
      orders={orderOptions}
      orderClick={handleOrderChange}
    >
      {filteredCompanies.map(({ id, name, isProfileComplete }) => (
        <FilterResult
          label={name}
          key={id}
          onClick={() => {
            onItemSelected && onItemSelected(id);
          }}
          isSelected={selectedItemId === id}
          testId="companyCard"
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
