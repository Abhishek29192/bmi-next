import { Typography } from "@bmi/components";
import classnames from "classnames";
import React from "react";
import styles from "./_FieldContainer.module.scss";

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
    <div className={classnames(styles["FieldContainer"], className)}>
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
