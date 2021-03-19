import React from "react";
import styles from "./AlternativeContent.module.scss";

type Props = {
  children: React.ReactNode;
};

const AlternativeContent = ({ children }: Props) => {
  return <span className={styles["AlternativeContent"]}>{children}</span>;
};

export default AlternativeContent;
