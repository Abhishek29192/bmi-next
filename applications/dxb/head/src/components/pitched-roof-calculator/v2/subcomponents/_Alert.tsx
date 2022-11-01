import { AlertBanner } from "@bmi-digital/components";
import classnames from "classnames";
import React from "react";
import styles from "./_Alert.module.scss";

type AlertProps = {
  type?: "info" | "warning";
  title: string;
  first?: boolean;
  last?: boolean;
  children: React.ReactNode;
};

const Alert = ({ type = "info", title, first, last, children }: AlertProps) => (
  <div
    className={classnames(
      styles["Alert"],
      first && styles[`Alert--first`],
      last && styles[`Alert--last`]
    )}
  >
    <AlertBanner severity={type}>
      <AlertBanner.Title>{title}</AlertBanner.Title>
      {children}
    </AlertBanner>
  </div>
);

export default Alert;
