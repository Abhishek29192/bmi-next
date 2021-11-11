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
  disabled,
  ...rest
}: Props) => {
  return (
    <div
      className={classnames(
        styles["RadioButton"],
        { [styles["RadioButton--disabled"] as string]: disabled },
        className
      )}
      style={style}
    >
      <input
        id={id}
        className={styles["input"]}
        type="radio"
        name={name}
        value={value}
        disabled={disabled}
        {...rest}
      />
      <label className={styles["label"]} htmlFor={id}>
        {before}
        <ButtonBase
          tabIndex={-1}
          component="div"
          className={styles["text"]}
          disabled={disabled}
        >
          {children}
        </ButtonBase>
      </label>
    </div>
  );
};

export default RadioButton;
