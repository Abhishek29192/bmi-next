import { Button as MaterialButton, ButtonProps } from "@bmi-digital/components";
import React from "react";
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
