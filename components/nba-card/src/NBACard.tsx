import React from "react";
import classnames from "classnames";
import ColorPair, { Colors } from "@bmi/color-pair";
import Typography from "@bmi/typography";
import { withClickable } from "@bmi/clickable";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import styles from "./NBACard.module.scss";

export type Props = Omit<ButtonBaseProps, "action"> & {
  theme: Colors;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  buttonComponent?: React.ComponentType<any>;
};

const NBACard = ({
  theme,
  title,
  children,
  footer,
  className,
  buttonComponent: Button = ButtonBase,
  ...rest
}: Props) => {
  return (
    <ColorPair
      markupComponent={Button}
      className={classnames(styles["NBACard"], className)}
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
