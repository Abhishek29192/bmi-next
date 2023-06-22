import React from "react";
// import { Tooltip } from "@bmi-digital/components";
import { TooltipProps } from "@bmi-digital/components/tooltip";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";

export const NoMaxWidthTooltip = styled((props: TooltipProps) => (
  <div>yeah</div>
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none"
  }
});
