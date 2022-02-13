import React from "react";
import Typography from "@bmi-digital/components/typography";
import styles from "./styles.module.scss";

export type TableContainerProps = {
  title: string;
  testid?: string;
  noResultsText?: string;
  children?: React.ReactNode | React.ReactNode[];
};

export const TableContainer = ({
  title,
  children,
  noResultsText,
  testid
}: TableContainerProps) => {
  return (
    <div data-testid={testid} className={styles.main}>
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
