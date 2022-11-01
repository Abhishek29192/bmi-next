import { Chip } from "@bmi-digital/components";
import React from "react";
import styles from "./styles.module.scss";

export type FilterButtonProps = {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
};

export const FilterButton = ({
  label,
  isActive,
  onClick
}: FilterButtonProps) => {
  return (
    <div className={styles.filterButton}>
      <Chip
        type="selectable"
        isSelected={isActive}
        onClick={() => onClick && onClick()}
      >
        {label}
      </Chip>
    </div>
  );
};
