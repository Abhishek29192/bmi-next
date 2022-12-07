import MuiCircularProgress, {
  CircularProgressProps as MuiCircularProgressProps
} from "@material-ui/core/CircularProgress";
import React from "react";
import styles from "./styles.module.scss";

export type CircularProgressProps = {
  backgroundProps?: MuiCircularProgressProps;
  railProps?: MuiCircularProgressProps;
  value: MuiCircularProgressProps["value"];
};

export const CircularProgress = ({
  backgroundProps,
  railProps,
  value
}: CircularProgressProps) => {
  return (
    <div
      className={styles.circularProgressContainer}
      data-testid="circular-progress"
    >
      <MuiCircularProgress
        size={120}
        thickness={6}
        variant="determinate"
        className={styles.circularProgress}
        {...backgroundProps}
      />
      <MuiCircularProgress
        className={styles.circularProgressRail}
        size={114}
        thickness={4}
        variant="determinate"
        {...railProps}
        value={100}
      />
      <div className={styles.circularProgressLabel}>{`${value}%`}</div>
    </div>
  );
};
