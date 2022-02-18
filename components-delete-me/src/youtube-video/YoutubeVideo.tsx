import useDimensions, { DimensionObject } from "@bmi-digital/use-dimensions";
import { Fade } from "@material-ui/core";
import { useTheme } from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";
import classnames from "classnames";
import React, { CSSProperties, useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
import AlternativeContent from "../alternative-content/AlternativeContent";
import Button from "../button/Button";
import Clickable from "../clickable/Clickable";
import ContainerDialog from "../container-dialog/ContainerDialog";
import Icon, { iconMap } from "../icon";
import Typography from "../typography/Typography";
import { YoutubeContext } from "../media-gallery/context";
import { getDefaultPreviewImageSource, getVideoURL } from "./utils";
import styles from "./YoutubeVideo.module.scss";

export type Props = {
  label: React.ReactNode;
  subtitle?: React.ReactNode;
  videoId: string;
  previewImageSource?: string | React.ReactNode;
  className?: string;
  embedHeight: number;
  embedWidth: number;
};

const getSize = (
  width: number,
  height: number,
  dimensions: DimensionObject
) => {
  if (!dimensions.width || !dimensions.height) {
    return {
      width,
      height
    };
  }

  const widthRatio = width ? dimensions.width / width : 0;
  const heightRatio = height ? dimensions.height / height : 0;
  const videoRatio = Math.max(widthRatio, heightRatio);

  return {
    width: width * videoRatio,
    height: height * videoRatio
  };
};
const sharedOptions = {
  modestbranding: 1,
  cc: 0,
  fs: 0,
  rel: 0,
  disablekb: 1,
  enablejsapi: 1
};
const playerStyle: CSSProperties = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};

const getValidPreviewImage = (
  previewImageSource: string | React.ReactNode,
  label: React.ReactNode
) => {
  return React.isValidElement(previewImageSource) ? (
    React.cloneElement(previewImageSource, {
      className: styles["preview-image"]
    })
  ) : (
    <img
      className={styles["preview-image"]}
      src={String(previewImageSource)}
      alt={String(label)}
    />
  );
};

const DialogVideo = ({
  videoId,
  className,
  previewImageSource = getDefaultPreviewImageSource(videoId),
  label,
  embedWidth,
  embedHeight
}: Props) => {
  // TODO: Create and use 'Container Dialog' when its done with ticket: https://bmigroup.atlassian.net/browse/DXB-1835
  // had to use this as the design wants to show player as portait / full height on mobile
  // and landscape/actual height of video when in all other resolution
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.only("xs"));
  const isXLDevice = useMediaQuery(theme.breakpoints.only("xl"));
  const showYouTubeVideo = useContext(YoutubeContext);
  const [isDialogOpen, setDialogOpen] = useState(showYouTubeVideo);
  const [ref, dimensions] = useDimensions();
  const { width, height } = getSize(embedWidth, embedHeight, dimensions);
  let calculatedHeight = dimensions.height;
  useEffect(() => {
    setDialogOpen(showYouTubeVideo);
  }, [showYouTubeVideo]);
  // this is to fix safari full height issue with css properties!
  // this allows us keep player's height at max available height of container at all times
  if (dimensions.width && height > 0 && width > 0) {
    calculatedHeight = (dimensions.width * height) / width;
  }
  // use fallback height if it can't get height from dimensions (that part may need further investigation)
  // but this one works well in all screen sizes
  if (calculatedHeight == 0 && height == 0) {
    calculatedHeight = window.innerHeight - 120;
  }
  const validImageComponent = getValidPreviewImage(previewImageSource, label);
  return (
    <div className={classnames(styles["YoutubeVideo"], className)}>
      <Clickable
        className={styles["thumbnail"]}
        aria-label={label}
        onClick={(_) => {
          setDialogOpen(true);
        }}
      >
        {validImageComponent}
        <AlternativeContent>{label}</AlternativeContent>
        <Button isIconButton className={styles["play-button"]} component="div">
          <Icon source={iconMap.PlayArrow} />
        </Button>
      </Clickable>
      <ContainerDialog
        maxWidth={"xl"}
        open={isDialogOpen}
        onCloseClick={() => setDialogOpen(false)}
      >
        <div ref={!!ref && ref} style={{ height: "100%", display: "flex" }}>
          {dimensions.width && (
            <ReactPlayer
              url={getVideoURL(videoId)}
              width="100%"
              height={isMobileDevice || isXLDevice ? "" : calculatedHeight}
              controls
              playing
              config={{
                playerVars: {
                  ...sharedOptions,
                  widgetid: 3
                }
              }}
            />
          )}
        </div>
      </ContainerDialog>
    </div>
  );
};

const InPlaceVideo = ({
  videoId,
  className,
  embedHeight,
  embedWidth
}: Props) => {
  const [ref, dimensions] = useDimensions();
  const { width, height } = getSize(embedWidth, embedHeight, dimensions);

  return (
    <div
      className={classnames(
        styles["YoutubeVideo"],
        styles["YoutubeVideo--in-place"],
        className
      )}
      ref={!!ref && ref}
    >
      {dimensions.width && (
        <ReactPlayer
          url={getVideoURL(videoId)}
          width={width}
          height={height}
          style={playerStyle}
          playing
          playsinline
          muted
          loop
          config={{
            playerVars: {
              ...sharedOptions,
              disablekb: 1
            }
          }}
        />
      )}
    </div>
  );
};

const InlineVideo = ({
  videoId,
  className,
  previewImageSource = getDefaultPreviewImageSource(videoId),
  subtitle,
  label,
  embedWidth = 16,
  embedHeight = 9
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const validImageComponent = getValidPreviewImage(previewImageSource, label);
  return (
    <div
      className={classnames(
        styles["YoutubeVideo"],
        styles["YoutubeVideo--inline"],
        className
      )}
      style={{ ["--aspect-ratio" as any]: embedHeight / embedWidth }}
      onClick={() => setIsPlaying(true)}
    >
      <div>
        {validImageComponent}
        <div className={styles["overlay"]}>
          <Button isIconButton className={styles["play-button"]}>
            <Icon source={iconMap.PlayArrow} />
          </Button>
          <Typography className={styles["subtitle"]}>{subtitle}</Typography>
        </div>
      </div>
      <Fade in={isPlaying} timeout={250} style={{ transitionDelay: "500ms" }}>
        <ReactPlayer
          url={getVideoURL(videoId)}
          controls
          playing={isPlaying}
          config={{
            playerVars: {
              ...sharedOptions,
              widgetid: 4
            }
          }}
        />
      </Fade>
    </div>
  );
};

export type Layout = "in-place" | "inline" | "dialog";

const YoutubeVideo = ({
  layout = "dialog",
  ...props
}: Props & { layout?: Layout }) => {
  switch (layout) {
    case "in-place":
      return <InPlaceVideo {...props} />;
    case "inline":
      return <InlineVideo {...props} />;
    case "dialog":
    default:
      return <DialogVideo {...props} />;
  }
};

export default YoutubeVideo;
