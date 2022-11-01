import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import { useStyles } from "./styles";

type Props = ButtonBaseProps & {
  direction: "left" | "right";
};
const ThumbScrollerButton = ({ direction, className, ...rest }: Props) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const classes = useStyles();
  return (
    <ButtonBase
      className={classnames(
        className,
        classes.root,
        classes[direction as "left" | "right"]
      )}
      aria-label={`Scroll ${direction}`}
      {...rest}
      tabIndex="-1"
    >
      <Icon className={classes.icon} />
    </ButtonBase>
  );
};

export default ThumbScrollerButton;
