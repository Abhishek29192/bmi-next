import React from "react";
import MUIContainer, { ContainerProps } from "@material-ui/core/Container";
import classnames from "classnames";
import styles from "./Container.module.scss";

export type Props = ContainerProps & { hasRevertOverflow?: boolean };

const Container = ({
  className,
  hasRevertOverflow,
  maxWidth = "xl",
  ...props
}: Props) => {
  return (
    <MUIContainer
      maxWidth={maxWidth}
      className={classnames(className, styles["Container"], {
        [styles[`Container--${maxWidth}`]]: maxWidth !== "xl",
        [styles["Container--no-overflow"]]: hasRevertOverflow
      })}
      {...props}
    />
  );
};

export default Container;
