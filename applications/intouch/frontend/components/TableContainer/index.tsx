import { Typography } from "@bmi-digital/components";
import classnames from "classnames";
import React from "react";
import styles from "./styles.module.scss";

export type TableContainerProps = {
  title: string;
  testid?: string;
  noResultsText?: string;
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

export const TableContainer = ({
  title,
  children,
  noResultsText,
  testid,
  className
}: TableContainerProps) => {
  return (
    <div data-testid={testid} className={classnames(styles.main, className)}>
      <Typography variant="h4" style={{ fontSize: "1.25rem" }} hasUnderline>
        {title}
      </Typography>

      <div className={styles.table}>
        {children ? (
          children
        ) : (
          <div className={styles.empty}>{noResultsText}</div>
        )}
      </div>
    </div>
  );
};
