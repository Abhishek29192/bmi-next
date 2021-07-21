import React from "react";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography";

import { FilterInput } from "../FilterInput";
import { FilterButton } from "../FilterButton";
import styles from "./styles.module.scss";

export type SidePanelProps = {
  searchLabel?: string;
  noResultLabel?: string;
  filters?: Record<string, any>;
  filterClick?: (filter) => void;
  showSearchFilter?: boolean;
  onSearchFilterChange?: (value: string) => void;
  children: React.ReactNode | React.ReactNode[];
  renderFooter?: () => React.ReactNode | React.ReactNode[];
};

export const SidePanel = ({
  searchLabel,
  filters,
  filterClick,
  showSearchFilter = true,
  onSearchFilterChange,
  children,
  noResultLabel,
  renderFooter
}: SidePanelProps) => {
  const { t } = useTranslation();
  const handleButtonClick = (filter) => {
    filterClick && filterClick(filter);
  };
  const handleInputOnChange = (value: string) => {
    onSearchFilterChange && onSearchFilterChange(value);
  };

  const filterButtons = (filters || []).map((filter) => (
    <FilterButton
      label={filter.label}
      key={filter.attr}
      isActive={filter.isActive}
      onClick={() => handleButtonClick(filter)}
    />
  ));
  return (
    <div className={styles.main}>
      <div className={styles.sidePanel}>
        <div className={styles.filters}>
          {showSearchFilter && (
            <FilterInput label={searchLabel} onChange={handleInputOnChange} />
          )}

          {filterButtons.length > 0 && (
            <div className={styles.filterButtons}>
              <span>Show Me:</span>

              {filterButtons}
            </div>
          )}
        </div>
        {React.Children.count(children) ? (
          <div className={styles.results}>{children}</div>
        ) : (
          <Typography className={styles.noResult} variant="h5">
            {noResultLabel || t("No result found")}
          </Typography>
        )}
        {renderFooter && (
          <div className={styles.footerBtn}>{renderFooter()}</div>
        )}
      </div>
    </div>
  );
};
