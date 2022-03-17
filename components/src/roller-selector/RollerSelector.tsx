import React from "react";
import classnames from "classnames";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";
import styles from "./RollerSelector.module.scss";

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
  return (
    <Component
      onClick={onClick}
      className={classnames(
        className,
        styles["RollerSelector"],
        isSelected && styles["RollerSelector--selected"]
      )}
      {...rest}
    >
      {children}
      <ArrowForward className={styles["icon"]} />
    </Component>
  );
};
export default RollerSelector;
