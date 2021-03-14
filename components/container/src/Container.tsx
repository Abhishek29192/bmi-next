import React from "react";
import MUIContainer, { ContainerProps } from "@material-ui/core/Container";
import styles from "./Container.module.scss";

export type Props = ContainerProps;

const Container = ({ className, maxWidth = "xl", ...props }: Props) => {
  return (
    <div className={styles["Container"]}>
      <MUIContainer maxWidth={maxWidth} className={className} {...props} />
    </div>
  );
};

export default Container;
