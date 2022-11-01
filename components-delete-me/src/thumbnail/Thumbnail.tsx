import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import { withClickable } from "../clickable/Clickable";
import Icon, { iconMap } from "../icon";
import Media, { AcceptedNode } from "../media/Media";
import { useStyles } from "./styles";

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
  const classes = useStyles();
  const backgroundImage =
    (imageSource && isVideo) || (imageSource && !media)
      ? { backgroundImage: `url("${imageSource}")` }
      : {};

  const accessibilityText =
    (altText && isVideo) || (altText && !media) ? (
      <span className={classes.accessibilityText}>{altText}</span>
    ) : null;

  return (
    <ButtonBase
      disabled={state === StateEnum.DISABLED}
      disableRipple={state === StateEnum.SELECTED}
      className={classnames(
        className,
        classes.root,
        // eslint-disable-next-line security/detect-object-injection
        state !== StateEnum.ENABLED && classes[state],
        size === SizeEnum.LARGE && classes.large,
        state === StateEnum.SELECTED && classes.selected
      )}
      {...rest}
      style={{
        backgroundColor: color,
        ...backgroundImage
      }}
      data-testid={"default-thumbnail"}
    >
      {accessibilityText}
      {media && !isVideo && <Media>{media}</Media>}
      {isVideo && (
        <Icon
          source={iconMap.PlayArrow}
          className={classes.playIcon}
          onClick={(e) => openYoutubeVideo && openYoutubeVideo(e)}
          data-testid={"thumbnail-play-icon"}
        />
      )}
      {visualiserParameters && (
        <Icon source={iconMap.Cube} className={classes.cubeIcon} name="Cube" />
      )}
    </ButtonBase>
  );
};

export default withClickable(Thumbnail);
