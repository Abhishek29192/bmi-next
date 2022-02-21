import React from "react";
import { ButtonBase } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import classnames from "classnames";
import Typography from "../typography/Typography";
import Icon from "../icon";
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
          <Icon className={styles["checkedIcon"]} source={CheckCircle} />
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
