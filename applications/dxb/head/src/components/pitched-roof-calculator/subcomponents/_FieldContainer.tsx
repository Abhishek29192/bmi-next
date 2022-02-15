import React from "react";
import { Typography } from "@bmi-digital/components";
import styles from "./_FieldContainer.module.scss";

type FieldContainerProps = {
  title?: string;
  help?: string;
  children: React.ReactNode;
};

const FieldContainer = ({ title, help, children }: FieldContainerProps) => {
  return (
    <div className={styles["FieldContainer"]}>
      {title || help ? (
        <div className={styles["head"]}>
          {title ? <Typography variant="h6">{title}</Typography> : null}
          {help ? (
            <Typography variant="body2" className={styles["help"]}>
              {help}
            </Typography>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
};

export default FieldContainer;
