import React from "react";
import classnames from "classnames";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { withClickable } from "../clickable/Clickable";
import ColorPair, { Colors } from "../color-pair/ColorPair";
import Typography from "../typography/Typography";
import styles from "./NBACard.module.scss";

export type Props = Omit<ButtonBaseProps, "action"> & {
  theme: Colors;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  buttonComponent?: React.ComponentType<any>;
  isClickable?: boolean;
};

const NBACard = ({
  theme,
  title,
  children,
  footer,
  className,
  buttonComponent: Button = ButtonBase,
  isClickable = true,
  ...rest
}: Props) => {
  return (
    <ColorPair
      markupComponent={isClickable ? Button : "div"}
      className={classnames(
        styles["NBACard"],
        {
          [`${styles["NBACard--clickable"]}`]: isClickable
        },
        className
      )}
      {...rest}
      theme={theme}
    >
      <Typography className={styles["title"]} variant="h4">
        {title}
      </Typography>
      <div className={styles["body"]}>{children}</div>
      {footer && <div className={styles["footer"]}>{footer}</div>}
    </ColorPair>
  );
};

export default withClickable<Props>(NBACard);