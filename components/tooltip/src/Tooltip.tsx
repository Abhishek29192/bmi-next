import React, { forwardRef } from "react";
import MuiTooltip, {
  TooltipProps as MuiTooltipProps
} from "@material-ui/core/Tooltip";
import classnames from "classnames";
import styles from "./Tooltip.module.scss";

const Tooltip = (
  { className, ...props }: MuiTooltipProps,
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
