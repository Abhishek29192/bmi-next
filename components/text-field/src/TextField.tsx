import React from "react";
import MaterialTextField, { TextFieldProps } from "@material-ui/core/TextField";
import styles from "./TextField.module.scss";
import classnames from "classnames";

type Props = Omit<TextFieldProps, "variant"> & {
  variant?: "outlined" | "hybrid";
  isTextArea?: boolean;
};

const TextField = ({ className, variant, isTextArea, ...props }: Props) => (
  <MaterialTextField
    {...props}
    multiline={isTextArea}
    variant={variant === "hybrid" ? "filled" : "outlined"}
    className={classnames(styles["TextField"], className)}
  />
);

export default TextField;
