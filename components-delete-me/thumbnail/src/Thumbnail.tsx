import React from "react";
import classnames from "classnames";
import { withClickable } from "@bmi-digital/components";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import { Media, AcceptedNode } from "@bmi-digital/components";
import { Icon, iconMap } from "@bmi-digital/components";
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
  openYoutubeVideo?: (e: React.MouseEvent<SVGElement>) => void;
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
  openYoutubeVideo,
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
      {isVideo && (
        <Icon
          source={iconMap.PlayArrow}
          className={styles["play-icon"]}
          onClick={(e) => openYoutubeVideo && openYoutubeVideo(e)}
        />
      )}
    </ButtonBase>
  );
};

export default withClickable(Thumbnail);
