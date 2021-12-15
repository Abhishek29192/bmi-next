import React from "react";
import Button from "@bmi/button";
import classnames from "classnames";
import ChevronRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ChevronLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import styles from "./ArrowControl.module.scss";

type Props = {
  direction: "left" | "right";
  onClick?: () => void;
};

const ArrowControl = ({ direction, onClick }: Props) => {
  // eslint-disable-next-line security/detect-object-injection
  const ArrowIcon = {
    left: ChevronLeftIcon,
    right: ChevronRightIcon
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
