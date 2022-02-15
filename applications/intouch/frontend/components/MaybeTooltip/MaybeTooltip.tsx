import React from "react";
import { Tooltip, TooltipProps } from "@bmi-digital/components";

export type MaybeTooltipProps = {
  show: boolean;
} & TooltipProps;

const MaybeTooltip = ({ children, show, ...props }: MaybeTooltipProps) => {
  if (!show) {
    return <>{children}</>;
  }

  // Span to accomodate tooltip hover behaviour while child may be disabled
  return (
    <Tooltip {...props}>
      <span>{children}</span>
    </Tooltip>
  );
};

export default MaybeTooltip;
