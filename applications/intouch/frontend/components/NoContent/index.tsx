import React from "react";
import styles from "./styles.module.scss";

export type NoContentProps = {
  message: string;
};

export const NoContent = ({ message }: NoContentProps) => {
  return <div className={styles.main}>{message}</div>;
};
