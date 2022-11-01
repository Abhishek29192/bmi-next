import React from "react";
import MaterialButton, { ButtonProps } from "../button/Button";
import { useStyles } from "./styles";

type Props = ButtonProps & {
  children: React.ReactNode;
};

const Button = ({ children, ...props }: Props) => {
  const classes = useStyles();
  return (
    <MaterialButton className={classes.button} {...props}>
      {children}
    </MaterialButton>
  );
};

export default Button;
