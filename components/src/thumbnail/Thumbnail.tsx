import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import { withClickable } from "../clickable/Clickable";
import Icon, { iconMap } from "../icon";
import Media, { AcceptedNode } from "../media/Media";
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
  visualiserParameters?: Record<string, string | number>;
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
  visualiserParameters,
  ...rest
}: Props) => {
  const classList = classnames(
    className,
    styles["Thumbnail"],
    state !== StateEnum.ENABLED && styles[`Thumbnail--${state}`],
    size === SizeEnum.LARGE && styles["Thumbnail--large"]
  );
  const backgroundImage =
    (imageSource && isVideo) || (imageSource && !media)
      ? { backgroundImage: `url("${imageSource}")` }
      : {};

  const accessibilityText =
    (altText && isVideo) || (altText && !media) ? (
      <span className={styles["accessibility-text"]}>{altText}</span>
    ) : null;

  return (
    <ButtonBase
      disabled={state === StateEnum.DISABLED}
      disableRipple={state === StateEnum.SELECTED}
      className={classList}
      aria-label={altText}
      {...rest}
      style={{
        backgroundColor: color,
        ...backgroundImage
      }}
    >
      {accessibilityText}
      {media && !isVideo && <Media>{media}</Media>}
      {isVideo && (
        <Icon
          source={iconMap.PlayArrow}
          className={styles["play-icon"]}
          onClick={(e) => openYoutubeVideo && openYoutubeVideo(e)}
        />
      )}
      {visualiserParameters && (
        <Icon
          source={iconMap.Cube}
          className={styles["cube-icon"]}
          name="Cube"
        />
      )}
    </ButtonBase>
  );
};

export default withClickable(Thumbnail);
