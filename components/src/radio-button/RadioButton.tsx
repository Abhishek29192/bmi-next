import { ButtonBase } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import { useStyles } from "./styles";

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
  const classes = useStyles();
  return (
    <div
      className={classnames(
        classes.root,
        disabled && classes.disabled,
        className
      )}
      style={style}
    >
      <input
        id={id}
        className={classes.input}
        type="radio"
        name={name}
        value={value}
        disabled={disabled}
        {...rest}
      />
      <label className={classes.label} htmlFor={id}>
        {before}
        <ButtonBase
          tabIndex={-1}
          component="div"
          className={classes.text}
          disabled={disabled}
        >
          {children}
        </ButtonBase>
      </label>
    </div>
  );
};

export default RadioButton;
