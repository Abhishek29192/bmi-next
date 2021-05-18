import React from "react";
import AlertBanner from "@bmi/alert-banner";
import classnames from "classnames";
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
    className={classnames(styles["Alert"], {
      [styles[`Alert--first`]]: first,
      [styles[`Alert--last`]]: last
    })}
  >
    <AlertBanner severity={type}>
      <AlertBanner.Title>{title}</AlertBanner.Title>
      {children}
    </AlertBanner>
  </div>
);

export default Alert;
