import React from "react";
import classnames from "classnames";
import styles from "./HidePrint.module.scss";

type Props = {
  children?: React.ReactNode;
  className?: string;
  component?: React.ElementType;
};

const HidePrint = ({ children, className, component = "div" }: Props) => {
  const Component = component;

  return (
    <Component className={classnames(className, styles["HidePrint"])}>
      {children}
    </Component>
  );
};

export default HidePrint;
