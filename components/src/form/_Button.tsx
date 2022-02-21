import React from "react";
import MaterialButton, { ButtonProps } from "../button/Button";
import styles from "./Form.module.scss";

type Props = ButtonProps & {
  children: React.ReactNode;
};

const Button = ({ children, ...props }: Props) => {
  return (
    <MaterialButton className={styles["Button"]} {...props}>
      {children}
    </MaterialButton>
  );
};

export default Button;
