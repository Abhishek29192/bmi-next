import React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import classnames from "classnames";
import styles from "./RadioButton.module.scss";

export type Props = {
  name?: string;
  value: string;
  id?: string;
  children: React.ReactNode;
  before?: React.ReactNode;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RadioButton = ({
  name,
  value,
  id = `radio-${name}-${value}`,
  children,
  before,
  className,
  style,
  ...rest
}: Props) => {
  return (
    <div className={classnames(styles["RadioButton"], className)} style={style}>
      <input
        id={id}
        className={styles["input"]}
        type="radio"
        name={name}
        value={value}
        {...rest}
      />
      <label className={styles["label"]} htmlFor={id}>
        {before}
        <ButtonBase tabIndex={-1} component="div" className={styles["text"]}>
          {children}
        </ButtonBase>
      </label>
    </div>
  );
};

export default RadioButton;
