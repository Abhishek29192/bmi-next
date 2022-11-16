import MuiLinearProgress, {
  LinearProgressProps as MuiLinearProgressProps
} from "@material-ui/core/LinearProgress";
import React from "react";
import { Typography } from "@bmi/components";
import styles from "./styles.module.scss";

export type CircularProgressProps = MuiLinearProgressProps & {
  stageValue: number;
  max: number;
};

export const LinearProgress = ({
  stageValue,
  max,
  ...props
}: CircularProgressProps) => {
  return (
    <div
      className={styles.linearProgressContainer}
      data-testid="linear-progress"
    >
      <MuiLinearProgress
        className={styles.linearProgress}
        variant="determinate"
        {...props}
      />
      <div className={styles.linearProgressLabel}>
        <Typography variant="body3">{`${stageValue} / ${max}`}</Typography>
      </div>
    </div>
  );
};
