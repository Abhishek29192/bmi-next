import React from "react";
import classnames from "classnames";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
import { ChevronLeft } from "@material-ui/icons";
import styles from "./ThumbScrollerButton.module.scss";

type Props = ButtonBaseProps & {
  direction: "left" | "right";
};
const ThumbScrollerButton = ({ direction, className, ...rest }: Props) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
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
