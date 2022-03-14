import { Collapse } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import classnames from "classnames";
import React, { forwardRef, MutableRefObject } from "react";
import Card from "../card/Card";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

export type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
  onCloseClick?: () => void;
  onExpandCompleted?: () => void;
};

const LinkCard = (
  {
    title,
    subtitle,
    isOpen = false,
    children,
    onClick,
    onCloseClick,
    onExpandCompleted,
    ...rest
  }: Props,
  forwardedRef:
    | ((instance: HTMLElement | null) => void)
    | MutableRefObject<HTMLElement | null>
    | null
) => {
  const classes = useStyles();
  return (
    <Card
      className={classnames(classes.root, isOpen && classes.open)}
      onClick={!isOpen ? onClick : undefined}
      ref={forwardedRef}
      {...rest}
    >
      <div
        className={classes.item}
        onClick={isOpen ? onCloseClick : undefined}
        data-testid={"linkCard-item"}
      >
        <Typography gutterBottom variant="h6">
          {title}
        </Typography>
        <Typography className={classes.subtitle}>{subtitle}</Typography>
      </div>
      <div className={classes.icon}>
        <KeyboardArrowRight onClick={isOpen ? onCloseClick : undefined} />
      </div>
      <Collapse
        in={isOpen}
        className={classes.details}
        collapsedSize={0}
        onEntered={(element, isAppearing) => {
          onExpandCompleted && onExpandCompleted();
        }}
      >
        {children}
      </Collapse>
    </Card>
  );
};

export default forwardRef<HTMLElement, Props>(LinkCard);
