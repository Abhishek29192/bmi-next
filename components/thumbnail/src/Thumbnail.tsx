import React from "react";
import classnames from "classnames";
import { withClickable } from "@bmi/clickable";
import ButtonBase, { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import styles from "./Thumbnail.module.scss";

export type Props = ButtonBaseProps & {
  altText: string;
  state?: "enabled" | "disabled" | "selected";
  imageSource?: string;
  color?: string;
  size?: "small" | "large";
};

const Thumbnail = ({
  altText,
  imageSource,
  color,
  state = "enabled",
  size = "small",
  className,
  ...rest
}: Props) => {
  return (
    <ButtonBase
      disabled={state === "disabled"}
      disableRipple={state === "selected"}
      className={classnames(
        className,
        styles["Thumbnail"],
        state !== "enabled" && styles[`Thumbnail--${state}`],
        size === "large" && styles["Thumbnail--large"]
      )}
      {...rest}
      style={{
        backgroundColor: color,
        backgroundImage: imageSource && `url("${imageSource}")`
      }}
    >
      <span className={styles["accessibility-text"]}>{altText}</span>
    </ButtonBase>
  );
};

export default withClickable(Thumbnail);
