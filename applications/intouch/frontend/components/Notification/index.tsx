import React from "react";
import styles from "./styles.module.scss";

export type NotificationProps = {
  children: React.ReactNode[];
};

export const Notification = ({ children }: NotificationProps) => (
  <div className={styles.main}>{children}</div>
);
