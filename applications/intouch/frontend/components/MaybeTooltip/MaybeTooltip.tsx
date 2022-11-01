import { Tooltip, TooltipProps } from "@bmi-digital/components";
import React from "react";

export type MaybeTooltipProps = {
  show: boolean;
} & TooltipProps;

const MaybeTooltip = ({ children, show, ...props }: MaybeTooltipProps) => {
  if (!show) {
    return <>{children}</>;
  }

  // Span to accommodate tooltip hover behaviour while child may be disabled.
  return (
    <Tooltip nonce={undefined} {...props}>
      <span>{children}</span>
    </Tooltip>
  );
};

export default MaybeTooltip;
