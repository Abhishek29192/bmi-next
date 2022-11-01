import { Typography } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React from "react";
import { FilterButton } from "../FilterButton";
import { FilterInput } from "../FilterInput";
import styles from "./styles.module.scss";

export type SidePanelProps = {
  searchLabel?: string;
  noResultLabel?: string;
  filters?: Record<string, any>;
  filterClick?: (filter) => void;
  showSearchFilter?: boolean;
  onSearchFilterChange?: (value: string) => void;
  children: React.ReactNode;
  renderFooter?: () => React.ReactNode;
  orders?: Record<string, any>;
  orderClick?: (order) => void;
};

export const SidePanel = ({
  searchLabel,
  filters,
  filterClick,
  showSearchFilter = true,
  onSearchFilterChange,
  children,
  noResultLabel,
  renderFooter,
  orders,
  orderClick
}: SidePanelProps) => {
  const { t } = useTranslation("common");
  const handleButtonClick = (filter) => {
    filterClick && filterClick(filter);
  };
  const handleOrderButtonClick = (order) => {
    orderClick && orderClick(order);
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

  const orderButtons = (orders || []).map((order) => (
    <FilterButton
      label={order.label}
      key={order.attr}
      isActive={order.isActive}
      onClick={() => handleOrderButtonClick(order)}
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
              <span>{t("Show me")}:</span>

              {filterButtons}
            </div>
          )}
          {orderButtons.length > 0 && (
            <div className={styles.filterButtons}>
              <span>{t("Sort by")}:</span>

              {orderButtons}
            </div>
          )}
        </div>
        {React.Children.count(children) ? (
          <div className={styles.results}>{children}</div>
        ) : (
          <Typography className={styles.noResult} variant="h5">
            {noResultLabel || t("fallback.noResults")}
          </Typography>
        )}
        {renderFooter && (
          <div className={styles.footerBtn}>{renderFooter()}</div>
        )}
      </div>
    </div>
  );
};
