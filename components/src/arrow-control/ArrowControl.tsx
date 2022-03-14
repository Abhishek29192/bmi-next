import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import Button from "../button/Button";
import { useStyles } from "./styles";

type Props = {
  direction: "left" | "right";
  onClick?: () => void;
};

const ArrowControl = ({ direction, onClick }: Props) => {
  const classes = useStyles();
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
      /* eslint-disable-next-line security/detect-object-injection */
      className={classnames(classes.root, classes[direction])}
      // TODO: Use a UI string for this.
      accessibilityLabel={`Move ${direction}`}
    >
      <ArrowIcon className={classes.chevron} />
    </Button>
  );
};

export default ArrowControl;
