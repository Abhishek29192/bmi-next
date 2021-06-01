import React from "react";
import Typography from "@bmi/typography";
import styles from "./styles.module.scss";

export type GenericCardProps = {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
};

export const GenericCard = ({ title, children }: GenericCardProps) => {
  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        {title}
      </Typography>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
