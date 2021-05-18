import React from "react";
import { FilterInput } from "../FilterInput";
import { FilterButton } from "../FilterButton";
import styles from "./styles.module.scss";

export type SidePanelProps = {
  searchLabel?: string;
  filters?: any;
  children: React.ReactNode | React.ReactNode[];
};

export const SidePanel = ({
  searchLabel,
  filters,
  children
}: SidePanelProps) => {
  const filterButtons = filters.map((filter) => (
    <FilterButton label={filter.label} key={filter.attr} />
  ));

  return (
    <div className={styles.sidePanel}>
      <div className={styles.filters}>
        <FilterInput label={searchLabel} />
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
  );
};
