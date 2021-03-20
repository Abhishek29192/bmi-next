import React from "react";
import styles from "./styles/SidePanel.module.scss";

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const SidePanel = ({ children }: Props) => (
  <div className={styles.sidePanel}>{children}</div>
);

export default SidePanel;
