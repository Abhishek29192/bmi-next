import React from "react";
import styles from "./styles.module.scss";

export type FiftyFiftyGridProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export const FiftyFiftyGrid = ({ children }: FiftyFiftyGridProps) => {
  return <div className={styles.main}>{children}</div>;
};
