import React from "react";
import styles from "./styles.module.scss";

export type UserDetailsProps = {
  message: string;
};

export const UserDetails = ({ message }: UserDetailsProps) => {
  return <div className={styles.main}>{message}</div>;
};
