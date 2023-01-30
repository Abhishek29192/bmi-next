import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { CircularProgressProps } from "@mui/material/CircularProgress/CircularProgress";
import classnames from "classnames";
import styles from "./styles/ProgressIndicator.module.scss";

type Props = CircularProgressProps & {
  theme?: "light" | "dark";
};

const ProgressIndicator = ({ className, theme, ...rest }: Props) => (
  <CircularProgress
    size={72}
    // NOTE: Intended thickness is 6px for large spinner, but MUI apears twice as thicc
    thickness={3}
    className={classnames(
      styles["ProgressIndicator"],
      theme && styles[`ProgressIndicator--${theme}`],
      className
    )}
    data-testid="progress-indicator"
    {...rest}
  />
);

export default ProgressIndicator;
