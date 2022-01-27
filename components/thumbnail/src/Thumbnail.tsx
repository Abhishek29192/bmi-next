import React from "react";
import classnames from "classnames";
import { withClickable } from "@bmi/clickable";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import Media, { AcceptedNode } from "@bmi/media";
import Icon, { iconMap } from "@bmi/icon";
import styles from "./Thumbnail.module.scss";

export enum StateEnum {
  ENABLED = "enabled",
  DISABLED = "disabled",
  SELECTED = "selected"
}
export enum SizeEnum {
  SMALL = "small",
  LARGE = "large"
}

export type Props = ButtonBaseProps & {
  media?: React.ReactElement<AcceptedNode>;
  altText?: string;
  state?: StateEnum;
  imageSource?: string;
  color?: string;
  size?: SizeEnum;
  isVideo: boolean;
};

const Thumbnail = ({
  media,
  altText,
  imageSource,
  color,
  state = StateEnum.ENABLED,
  size = SizeEnum.SMALL,
  className,
  isVideo = false,
  ...rest
}: Props) => {
  const classList = classnames(
    className,
    styles["Thumbnail"],
    state !== StateEnum.ENABLED && styles[`Thumbnail--${state}`],
    size === SizeEnum.LARGE && styles["Thumbnail--large"]
  );
  return (
    <ButtonBase
      disabled={state === StateEnum.DISABLED}
      disableRipple={state === StateEnum.SELECTED}
      className={classList}
      {...rest}
      style={{
        backgroundColor: color,
        backgroundImage: imageSource && `url("${imageSource}")`
      }}
    >
      {altText && (
        <span className={styles["accessibility-text"]}>{altText}</span>
      )}
      {media && <Media>{media}</Media>}
      <span className={styles["accessibility-text"]}>{altText}</span>
      {isVideo && (
        <Icon source={iconMap.PlayArrow} className={styles["play-icon"]} />
      )}
    </ButtonBase>
  );
};

export default withClickable(Thumbnail);
