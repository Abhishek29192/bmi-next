import React from "react";
import classnames from "classnames";
import { KeyboardArrowRight } from "@material-ui/icons";
import { KeyboardArrowLeft } from "@material-ui/icons";
import Button from "../button/Button";
import styles from "./ArrowControl.module.scss";

type Props = {
  direction: "left" | "right";
  onClick?: () => void;
};

const ArrowControl = ({ direction, onClick }: Props) => {
  // eslint-disable-next-line security/detect-object-injection
  const ArrowIcon = {
    left: KeyboardArrowLeft,
    right: KeyboardArrowRight
  }[direction];

  return (
    <Button
      isIconButton
      size="medium"
      onClick={() => onClick && onClick()}
      className={classnames(
        styles["ArrowControl"],
        styles[`ArrowControl--${direction}`]
      )}
      // TODO: Use a UI string for this.
      accessibilityLabel={`Move ${direction}`}
    >
      <ArrowIcon className={styles["chevron"]} />
    </Button>
  );
};

export default ArrowControl;
