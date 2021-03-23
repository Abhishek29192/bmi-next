import React, { CSSProperties, useState } from "react";
import Button from "@bmi/button";
import Dialog from "@bmi/dialog";
import ReactPlayer from "react-player/youtube";
import Icon, { iconMap } from "@bmi/icon";
import AlternativeContent from "@bmi/alternative-content";
import useDimensions, { DimensionObject } from "@bmi/use-dimensions";
import classnames from "classnames";
import styles from "./YoutubeVideo.module.scss";

type Props = {
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

  const widthRatio = dimensions.width / width;
  const heightRatio = dimensions.height / height;
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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const [ref, dimensions] = useDimensions();
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
      <Dialog
        maxWidth={"xl"}
        open={isDialogOpen}
        onCloseClick={() => setDialogOpen(false)}
        className={styles["PlayerDialog"]}
      >
        <Dialog.Title>{null}</Dialog.Title>
        <Dialog.Content className={styles["dialog-content"]}>
          <div ref={ref} className={styles["video-container"]}>
            {dimensions.width && (
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
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
        </Dialog.Content>
        <Dialog.Actions confirmLabel={null} />
      </Dialog>
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
