import React from "react";
import { CircularProgressProps } from "@mui/material/CircularProgress/CircularProgress";
import classnames from "classnames";
import {
  StyledProgressIndicator,
  classes
} from "./styles/ProgressIndicator.styles";

type Props = CircularProgressProps & {
  theme?: "light" | "dark";
};

const ProgressIndicator = ({ className, theme, ...rest }: Props) => (
  <StyledProgressIndicator
    size={72}
    // NOTE: Intended thickness is 6px for large spinner, but MUI apears twice as thicc
    thickness={3}
    className={classnames(
      theme && classes[`progressIndicator--${theme}`],
      className
    )}
    data-testid="progress-indicator"
    {...rest}
  />
);

export default ProgressIndicator;
