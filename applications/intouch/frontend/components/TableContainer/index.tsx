import React from "react";
import Typography from "@bmi/typography";
import styles from "./styles.module.scss";

export type TableContainerProps = {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
};

export const TableContainer = ({ title, children }: TableContainerProps) => {
  return (
    <div className={styles.main}>
      <Typography variant="h4" style={{ fontSize: "1.25rem" }} hasUnderline>
        {title}
      </Typography>

      {/*  */}
      <div className={styles.table}>
        {children ? (
          children
        ) : (
          <div className={styles.empty}>User has no certifications</div>
        )}
      </div>
    </div>
  );
};
