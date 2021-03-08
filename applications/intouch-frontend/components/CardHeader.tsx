import React from "react";
import styles from "./styles/CardHeader.module.scss";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const CardHeader = ({ children }: Props) => (
  <div className={styles.cardHeader}>{children}</div>
);

export default CardHeader;
