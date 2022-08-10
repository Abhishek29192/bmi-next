import React, { forwardRef } from "react";
import {
  Tooltip as MuiTooltip,
  TooltipProps as MuiTooltipProps
} from "@material-ui/core";
import classnames from "classnames";
import styles from "./Tooltip.module.scss";

export type TooltipProps = MuiTooltipProps;

const Tooltip = (
  { className, ...props }: TooltipProps,
  ref: React.Ref<any>
) => {
  return (
    <MuiTooltip
      {...props}
      className={classnames(className, styles["Tooltip"])}
      ref={ref}
    />
  );
};

export default forwardRef(Tooltip);