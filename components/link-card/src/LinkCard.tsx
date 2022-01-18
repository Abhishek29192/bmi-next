import React, { forwardRef, MutableRefObject } from "react";
import classnames from "classnames";
import ChevronRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Card from "@bmi/card";
import Typography from "@bmi/typography";
import Collapse from "@material-ui/core/Collapse";
import styles from "./LinkCard.module.scss";

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
  return (
    <Card
      className={classnames(
        styles["LinkCard"],
        isOpen && styles[`LinkCard--selected`]
      )}
      onClick={!isOpen ? onClick : undefined}
      ref={forwardedRef}
      {...rest}
    >
      <div
        className={styles["item"]}
        onClick={isOpen ? onCloseClick : undefined}
      >
        <Typography gutterBottom variant="h6">
          {title}
        </Typography>
        <Typography className={styles["subtitle"]}>{subtitle}</Typography>
      </div>
      <div className={styles["icon"]}>
        <ChevronRightIcon onClick={isOpen ? onCloseClick : undefined} />
      </div>
      <Collapse
        in={isOpen}
        className={styles["details"]}
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
