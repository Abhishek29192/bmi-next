import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
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
      aria-label={`Scroll ${direction}`}
      {...rest}
      tabIndex="-1"
    >
      <Icon className={styles["icon"]} />
    </ButtonBase>
  );
};

export default ThumbScrollerButton;
