import classnames from "classnames";
import React, { useEffect, useState } from "react";
import Icon, { iconMap } from "../icon";
import Media from "../media/Media";
import Truncate from "../truncate/Truncate";
import Typography from "../typography/Typography";
import { YoutubeContext } from "./context";
import { useMediaGalleryStyles } from "./styles";
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

const MediaGallery = ({
  media,
  mediaSize = "contain",
  layout = "default",
  className,
  thumbnailComponent
}: Props) => {
  const classes = useMediaGalleryStyles();
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
    if (media && media.length) {
      const medias = [...media];
      setCurrentMedias(medias);
      setCurrentMedia(medias[Number(activeImageIndex)]);
    }
  }, [media]);

  if (!media || !media.length) {
    return null;
  }

  return (
    <div className={classnames(classes.root, className)}>
      {currentMedia && (
        <div
          className={classnames(
            classes.imageWrapper,
            currentMedia.visualiserParameters && classes.visualiserSlide
          )}
          onClick={onSlideClick}
        >
          <YoutubeContext.Provider value={showYouTubeVideo}>
            {currentMedia?.media && (
              <Media
                size={mediaSize}
                className={classnames(
                  classes.mainImageWrapper,
                  mediaSize === "cover" && classes.mainImageWrapperCover,
                  layout && classes[`mainImageWrapper${layout}`]
                )}
              >
                {currentMedia?.media}
              </Media>
            )}
          </YoutubeContext.Provider>
          {currentMedia.caption ? (
            <div className={classes.caption}>
              <Typography
                variant="h6"
                component="p"
                className={classes.captionText}
              >
                <Truncate lines={2}>{currentMedia.caption}</Truncate>
              </Typography>
            </div>
          ) : null}
          {currentMedia.visualiserParameters ? (
            <div className={classes.captionHolder}>
              <div className={classes.cubeHolder}>
                <Icon
                  source={iconMap.Cube}
                  className={classes.cubeIcon}
                  name="Cube"
                />
              </div>
              <Typography
                variant="h6"
                component="p"
                className={classes.captionText}
              >
                {currentMedia.visualiserParameters.caption}
              </Typography>
            </div>
          ) : null}
        </div>
      )}
      {currentMedias && currentMedias.length > 1 && (
        <Thumbnails
          media={currentMedias}
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
