import { Typography } from "@bmi-digital/components";
import React from "react";
import { Root, StyledHead, StyledHelp } from "./_FieldContainer.styles";

type FieldContainerProps = {
  title?: string;
  help?: string;
  children: React.ReactNode;
  className?: string;
};

const FieldContainer = ({
  title,
  help,
  children,
  className
}: FieldContainerProps) => {
  return (
    <Root className={className}>
      {title || help ? (
        <StyledHead>
          {title ? <Typography variant="h6">{title}</Typography> : null}
          {help ? <StyledHelp variant="body2">{help}</StyledHelp> : null}
        </StyledHead>
      ) : null}
      {children}
    </Root>
  );
};

export default FieldContainer;
