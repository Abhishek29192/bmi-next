import { Typography } from "@bmi/components";
import React from "react";
import styles from "./_FieldContainer.module.scss";

type FieldContainerProps = {
  title?: string;
  help?: string;
  children: React.ReactNode;
  titleClassName?: string;
};

const FieldContainer = ({
  title,
  help,
  children,
  titleClassName
}: FieldContainerProps) => {
  return (
    <div className={styles["FieldContainer"]}>
      {title || help ? (
        <div className={styles["head"]}>
          {title ? (
            <Typography variant="h6" className={titleClassName}>
              {title}
            </Typography>
          ) : null}
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
