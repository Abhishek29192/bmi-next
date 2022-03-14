import {
  Tooltip as MuiTooltip,
  TooltipProps as MuiTooltipProps
} from "@material-ui/core";
import classnames from "classnames";
import React, { forwardRef } from "react";
import { useStyles } from "./styles";

export type TooltipProps = MuiTooltipProps;

const Tooltip = (
  { className, ...props }: TooltipProps,
  ref: React.Ref<any>
) => {
  const classes = useStyles();
  return (
    <MuiTooltip
      {...props}
      className={classnames(className, classes.root)}
      ref={ref}
    />
  );
};

export default forwardRef(Tooltip);
