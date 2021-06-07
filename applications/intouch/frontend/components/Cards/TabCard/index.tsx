import React from "react";
import styles from "./styles.module.scss";

export type TabCardProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export const TabCard = ({ children }: TabCardProps) => {
  return (
    <div className={styles.main}>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
