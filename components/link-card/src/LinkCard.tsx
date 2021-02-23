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
};

const LinkCard = (
  { title, subtitle, isOpen = false, children, onClick, onCloseClick }: Props,
  forwardedRef: MutableRefObject<HTMLElement>
) => {
  return (
    <Card
      className={classnames(styles["LinkCard"], {
        [styles[`LinkCard--selected`]]: isOpen
      })}
      onClick={!isOpen ? onClick : null}
      ref={forwardedRef}
    >
      <div className={styles["item"]} onClick={isOpen ? onCloseClick : null}>
        <Typography gutterBottom variant="h6">
          {title}
        </Typography>
        <Typography className={styles["subtitle"]}>{subtitle}</Typography>
      </div>
      <div className={styles["icon"]}>
        <ChevronRightIcon onClick={isOpen ? onCloseClick : null} />
      </div>
      <Collapse in={isOpen} className={styles["details"]} collapsedHeight={0}>
        {children}
      </Collapse>
    </Card>
  );
};

export default forwardRef<HTMLElement, Props>(LinkCard);
