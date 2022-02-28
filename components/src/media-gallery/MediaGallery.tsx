import React, { useState } from "react";
import classnames from "classnames";
import Media from "../media/Media";
import Truncate from "../truncate/Truncate";
import Typography from "../typography/Typography";
import DesktopThumbnails from "./_DesktopThumbnails";
import MobileThumbnails from "./_MobileThumbnails";
import { Media as MediaData } from "./types";
import styles from "./MediaGallery.module.scss";
import { YoutubeContext } from "./context";

type Props = {
  media: readonly MediaData[];
  mediaSize?: "cover" | "contain";
  thumbnailComponent?: React.ComponentType<any>;
  layout?: "default" | "short";
  className?: string;
};

const renderThumbnails = () => {
  const isTouchDevice =
    typeof document !== `undefined` &&
    "ontouchstart" in document.documentElement;
  return isTouchDevice ? MobileThumbnails : DesktopThumbnails;
};
const renderMedia = (
  { media }: MediaData,
  mediaSize: Props["mediaSize"],
  layout?: Props["layout"]
) => {
  const className = classnames(
    styles["main-image-wrapper"],
    mediaSize !== "contain" && styles[`main-image-wrapper--${mediaSize}`],
    styles[`main-image-wrapper--${layout}`]
  );

  if (media) {
    return (
      <Media size={mediaSize} className={className}>
        {media}
      </Media>
    );
  }

  return null;
};

const MediaGallery = ({
  media = [],
  mediaSize = "contain",
  layout = "default",
  className,
  thumbnailComponent
}: Props) => {
  if (!media.length) {
    return null;
  }
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showYouTubeVideo, setShowYouTubeVideo] = useState<boolean>(false);
  const Thumbnails = renderThumbnails();
  const onPlayIconClick = (e: React.MouseEvent<SVGElement>, index: number) => {
    e.stopPropagation();
    if (index === activeImageIndex) {
      setShowYouTubeVideo(true);
    } else {
      setActiveImageIndex(index);
    }
  };

  const onThumbnailClick = (e: Event, index: number) => {
    e.preventDefault();
    setActiveImageIndex(index);
    setShowYouTubeVideo(false);
  };
  const currentMedia = media[Number(activeImageIndex)];
  return (
    <div className={classnames(styles["MediaGallery"], className)}>
      <div className={styles["image-wrapper"]}>
        <YoutubeContext.Provider value={showYouTubeVideo}>
          {renderMedia(currentMedia, mediaSize, layout)}
        </YoutubeContext.Provider>
        {currentMedia.caption ? (
          <div className={styles["caption"]}>
            <Typography
              variant="h6"
              component="p"
              className={styles["caption-text"]}
            >
              <Truncate lines={2}>{currentMedia.caption}</Truncate>
            </Typography>
          </div>
        ) : null}
      </div>
      {media.length > 1 && (
        <Thumbnails
          images={media}
          component={thumbnailComponent}
          activeImageIndex={activeImageIndex}
          onThumbnailClick={onThumbnailClick}
          openYoutubeVideo={onPlayIconClick}
        />
      )}
    </div>
  );
};
export default MediaGallery;
