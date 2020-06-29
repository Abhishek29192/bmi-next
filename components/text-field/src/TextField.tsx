import React from "react";
import MaterialTextField, { TextFieldProps } from "@material-ui/core/TextField";
import styles from "./TextField.module.scss";
import classnames from "classnames";

type Props = Omit<TextFieldProps, "variant"> & {
  variant?: "outlined" | "hybrid";
};

const TextField = ({ className, variant, ...props }: Props) => (
  <MaterialTextField
    {...props}
    variant={variant === "hybrid" ? "filled" : "outlined"}
    className={classnames(styles["TextField"], className)}
  />
);

export default TextField;
