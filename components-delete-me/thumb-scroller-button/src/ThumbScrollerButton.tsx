import React from "react";
import classnames from "classnames";
import ButtonBase, { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import styles from "./ThumbScrollerButton.module.scss";

type Props = ButtonBaseProps & {
  direction: "left" | "right";
};
const ThumbScrollerButton = ({ direction, className, ...rest }: Props) => {
  const Icon = direction === "left" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <ButtonBase
      className={classnames(
        className,
        styles["ThumbScrollerButton"],
        styles[`ThumbScrollerButton--${direction}`]
      )}
      {...rest}
      tabIndex="-1"
    >
      <Icon className={styles["icon"]} />
    </ButtonBase>
  );
};

export default ThumbScrollerButton;
