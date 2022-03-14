import classnames from "classnames";
import React from "react";
import { useStyles } from "./styles";

type Props = {
  children?: React.ReactNode;
  className?: string;
  component?: React.ElementType;
};

const HidePrint = ({ children, className, component = "div" }: Props) => {
  const classes = useStyles();
  const Component = component;

  return (
    <Component className={classnames(className, classes.root)}>
      {children}
    </Component>
  );
};

export default HidePrint;
