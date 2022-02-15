import React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Typography } from "@bmi-digital/components";
import { Icon } from "@bmi-digital/components";
import classnames from "classnames";
import styles from "./RadioPane.module.scss";

export type Props = {
  title: string;
  className?: string;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RadioPane = ({ title, className, children, ...rest }: Props) => {
  return (
    <label className={classnames(styles["RadioPane"], className)}>
      <input className={styles["input"]} type="radio" {...rest} />
      <ButtonBase component="div" tabIndex={-1} className={styles["pane"]}>
        <div className={styles["header"]}>
          <Typography variant="h6" className={styles["title"]}>
            {title}
          </Typography>
          <Icon className={styles["checkedIcon"]} source={CheckCircleIcon} />
        </div>
        {children ? (
          <div className={styles["content"]}>
            <Divider className={styles["hr"]} />
            {children}
          </div>
        ) : null}
      </ButtonBase>
    </label>
  );
};

export default RadioPane;
