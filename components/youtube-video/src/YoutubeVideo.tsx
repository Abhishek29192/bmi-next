import React, { CSSProperties, useState } from "react";
import Button from "@bmi/button";
import ContainerDialog from "@bmi/container-dialog";
import ReactPlayer from "react-player/youtube";
import Icon, { iconMap } from "@bmi/icon";
import AlternativeContent from "@bmi/alternative-content";
import useDimensions, { DimensionObject } from "@bmi/use-dimensions";
import classnames from "classnames";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import styles from "./YoutubeVideo.module.scss";

export type Props = {
  label: React.ReactNode;
  subtitle?: React.ReactNode;
  videoId: string;
  previewImageSource?: string;
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

const DialogVideo = ({
  videoId,
  className,
  previewImageSource = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
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

  const [isDialogOpen, setDialogOpen] = useState(false);
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const [ref, dimensions] = useDimensions();
  const { width, height } = getSize(embedWidth, embedHeight, dimensions);
  let calculatedHeight = dimensions.height;
  // this is to fix safari full height issue with css properties!
  // this allows us keep player's height at max available height of container at all times
  if (dimensions.width && height > 0 && width > 0) {
    calculatedHeight = (dimensions.width * height) / width;
  }

  return (
    <div
      className={classnames(styles["YoutubeVideo"], className)}
      style={{ backgroundImage: `url(${previewImageSource})` }}
    >
      <AlternativeContent>{label}</AlternativeContent>
      <Button
        isIconButton
        onClick={(e) => {
          setDialogOpen(true);
        }}
        className={styles["play-button"]}
      >
        <Icon source={iconMap.PlayArrow} />
      </Button>
      <ContainerDialog
        maxWidth={"xl"}
        open={isDialogOpen}
        onCloseClick={() => setDialogOpen(false)}
      >
        <div ref={ref} style={{ height: "100%", display: "flex" }}>
          {dimensions.width && (
            <ReactPlayer
              url={videoUrl}
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
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const [ref, dimensions] = useDimensions();
  const { width, height } = getSize(embedWidth, embedHeight, dimensions);

  return (
    <div
      className={classnames(
        styles["YoutubeVideo"],
        styles["YoutubeVideo--in-place"],
        className
      )}
      ref={ref}
    >
      {dimensions.width && (
        <ReactPlayer
          url={videoUrl}
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

export type Layout = "in-place" | "dialog";

const YoutubeVideo = ({
  layout = "dialog",
  ...props
}: Props & { layout?: Layout }) => {
  if (layout === "in-place") {
    return <InPlaceVideo {...props} />;
  }

  return <DialogVideo {...props} />;
};

export default YoutubeVideo;
