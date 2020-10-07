import React from "react";
import classnames from "classnames";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import ArrowIcon from "@material-ui/icons/ArrowForward";
import styles from "./RollerSelector.module.scss";

type Props = {
  children: React.ReactNode;
  isSelected?: boolean;
} & ButtonBaseProps;

const RollerSelector = ({
  children,
  isSelected,
  onClick,
  className,
  ...rest
}: Props) => {
  return (
    <ButtonBase
      onClick={onClick}
      className={classnames(className, styles["RollerSelector"], {
        [styles["RollerSelector--selected"]]: isSelected
      })}
      {...rest}
    >
      {children}
      <ArrowIcon className={styles["icon"]} />
    </ButtonBase>
  );
};
export default RollerSelector;
