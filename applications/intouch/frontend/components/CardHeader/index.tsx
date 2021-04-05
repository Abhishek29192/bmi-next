import React from "react";
import styles from "./styles.module.scss";

export type CardHeaderProps = {
  children: React.ReactNode | React.ReactNode[];
};

export const CardHeader = ({ children }: CardHeaderProps) => (
  <div className={styles.cardHeader}>{children}</div>
);
