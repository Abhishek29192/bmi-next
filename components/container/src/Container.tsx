import React from "react";
import MUIContainer, { ContainerProps } from "@material-ui/core/Container";
import classnames from "classnames";
import styles from "./Container.module.scss";

const Container = ({
  className,
  maxWidth = "xl",
  ...props
}: ContainerProps) => {
  return (
    <MUIContainer
      maxWidth={maxWidth}
      className={classnames(className, styles["Container"], {
        [styles[`Container--${maxWidth}`]]: maxWidth !== "xl"
      })}
      {...props}
    />
  );
};

export default Container;
