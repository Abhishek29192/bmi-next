import React from "react";
import styles from "./styles.module.scss";

export type SidePanelProps = {
  children: React.ReactNode | React.ReactNode[];
};

export const SidePanel = ({ children }: SidePanelProps) => (
  <div className={styles.sidePanel}>{children}</div>
);
