import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import { useStyles } from "./styles";

type Props = {
  children: React.ReactNode;
  component?: React.ComponentType<any>; // TODO
  isSelected?: boolean;
} & ButtonBaseProps;

const RollerSelector = ({
  children,
  component: Component = ButtonBase,
  isSelected,
  onClick,
  className,
  ...rest
}: Props) => {
  const classes = useStyles();
  return (
    <Component
      onClick={onClick}
      className={classnames(
        className,
        classes.root,
        isSelected && classes.selected
      )}
      {...rest}
    >
      {children}
      <ArrowForward className={classes.icon} />
    </Component>
  );
};
export default RollerSelector;
