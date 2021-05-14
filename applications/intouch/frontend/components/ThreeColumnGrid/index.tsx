import React from "react";
import styles from "./styles.module.scss";

// WIP
export type ThreeColumnGridProps = {
  children: React.ReactNode | React.ReactNode[];
};

export const ThreeColumnGrid = ({ children }: ThreeColumnGridProps) => (
  <div className={styles.main}>{children}</div>
);
