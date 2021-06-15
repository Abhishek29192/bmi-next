import React from "react";
import { FilterInput } from "../FilterInput";
import { FilterButton } from "../FilterButton";
import styles from "./styles.module.scss";

export type SidePanelProps = {
  searchLabel?: string;
  filters?: Record<string, any>;
  filterClick?: (filter) => void;
  showSearchFilter?: boolean;
  onSearchFilterChange?: (value: string) => void;
  children: React.ReactNode | React.ReactNode[];
};

export const SidePanel = ({
  searchLabel,
  filters,
  filterClick,
  showSearchFilter = true,
  onSearchFilterChange,
  children
}: SidePanelProps) => {
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

          <div className={styles.filterButtons}>
            <span
              style={{
                fontWeight: "bold",
                display: "inline-block",
                marginRight: "0.5em",
                paddingBottom: "0.5em"
              }}
            >
              Show Me:
            </span>

            {filterButtons}
          </div>
        </div>
        <div className={styles.results}>{children}</div>
      </div>
    </div>
  );
};
