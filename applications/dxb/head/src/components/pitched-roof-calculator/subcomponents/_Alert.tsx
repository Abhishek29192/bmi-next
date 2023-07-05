import { AlertBanner } from "@bmi-digital/components";
import classnames from "classnames";
import React from "react";
import { Root, classes } from "./_Alert.styles";

type AlertProps = {
  type?: "info" | "warning";
  title: string;
  first?: boolean;
  last?: boolean;
  children: React.ReactNode;
};

const Alert = ({ type = "info", title, first, last, children }: AlertProps) => (
  <Root className={classnames(first && classes.first, last && classes.last)}>
    <AlertBanner severity={type}>
      <AlertBanner.Title>{title}</AlertBanner.Title>
      {children}
    </AlertBanner>
  </Root>
);

export default Alert;
