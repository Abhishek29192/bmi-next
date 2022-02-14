import React from "react";
import MUIContainer, { ContainerProps } from "@material-ui/core/Container";
import classnames from "classnames";
import styles from "./Container.module.scss";

export type Props = ContainerProps & {
  wrapperClassName?: string;
  fullWidth?: boolean;
};

const Container = ({
  className,
  maxWidth = "xl",
  wrapperClassName,
  fullWidth,
  ...props
}: Props) => {
  return (
    <div
      className={classnames(
        styles["Container"],
        {
          [styles["Container--full-width"]!]: fullWidth
        },
        wrapperClassName
      )}
    >
      <MUIContainer maxWidth={maxWidth} className={className} {...props} />
    </div>
  );
};

export default Container;
