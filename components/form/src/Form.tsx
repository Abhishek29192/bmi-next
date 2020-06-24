import React from "react";
import styles from "./Form.module.scss";

type Props = {
  children: React.ReactNode;
} & React.HTMLProps<HTMLFormElement>;

const Form = ({ children, ...formProps }: Props) => {
  return (
    <form className={styles["Form"]} {...formProps}>
      {children}
    </form>
  );
};

const FormRow = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles["Row"]}>{children}</div>;
};

Form.Row = FormRow;

export default Form;
