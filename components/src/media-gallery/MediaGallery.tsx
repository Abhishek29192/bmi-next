import classnames from "classnames";
import React, { useEffect, useState } from "react";
import Icon, { iconMap } from "../icon";
import Media from "../media/Media";
import Truncate from "../truncate/Truncate";
import Typography from "../typography/Typography";
import { YoutubeContext } from "./context";
import styles from "./MediaGallery.module.scss";
import { Media as MediaData } from "./types";
import DesktopThumbnails from "./_DesktopThumbnails";
import MobileThumbnails from "./_MobileThumbnails";

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
  mediaData: MediaData,
  mediaSize: Props["mediaSize"],
  layout?: Props["layout"]
) => {
  if (!mediaData) {
    return null;
  }
  const { media } = mediaData;
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
  const [currentMedias, setCurrentMedias] = useState<MediaData[]>([]);
  const [currentMedia, setCurrentMedia] = useState<MediaData | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showYouTubeVideo, setShowYouTubeVideo] = useState<boolean>(false);

  const Thumbnails = renderThumbnails();

  const onPlayIconClick = (e: React.MouseEvent<SVGElement>, index: number) => {
    e.stopPropagation();
    if (index === activeImageIndex) {
      setShowYouTubeVideo(true);
    } else {
      setActiveImageIndex(index);
      setCurrentMedia(currentMedias[Number(index)]);
    }
  };

  const onSlideClick = () => {
    if (
      currentMedia &&
      currentMedia.visualiserParameters &&
      typeof currentMedia.openVisualiser === "function"
    ) {
      currentMedia.openVisualiser(currentMedia.visualiserParameters);
    }
  };

  const onThumbnailClick = (e: Event, index: number) => {
    e.preventDefault();
    setActiveImageIndex(index);
    setCurrentMedia(currentMedias[Number(index)]);
    setShowYouTubeVideo(false);
  };

  useEffect(() => {
    const medias = [...media];
    setCurrentMedias(medias);
    setCurrentMedia(medias[Number(activeImageIndex)]);
  }, [media]);

  if (!media.length) {
    return null;
  }

  return (
    <div className={classnames(styles["MediaGallery"], className)}>
      {currentMedia && (
        <div
          className={classnames(
            styles["image-wrapper"],
            styles[currentMedia.visualiserParameters ? "visualiser-slide" : ""]
          )}
          onClick={onSlideClick}
        >
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
          {currentMedia.visualiserParameters ? (
            <div className={styles["caption-holder"]}>
              <div className={styles["cube-holder"]}>
                <Icon
                  source={iconMap.Cube}
                  className={styles["cube-icon"]}
                  name="Cube"
                />
              </div>
              <Typography
                variant="h6"
                component="p"
                className={styles["caption-text"]}
              >
                {currentMedia.visualiserParameters.caption}
              </Typography>
            </div>
          ) : null}
        </div>
      )}
      {currentMedias.length > 1 && (
        <Thumbnails
          images={currentMedias}
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
