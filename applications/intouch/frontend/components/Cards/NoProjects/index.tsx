import React from "react";
import Typography from "@bmi-digital/components/typography";
import styles from "./styles.module.scss";

export type NoProjectsCardProps = {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
};

export const NoProjectsCard = ({ title, children }: NoProjectsCardProps) => {
  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        {title}
      </Typography>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
