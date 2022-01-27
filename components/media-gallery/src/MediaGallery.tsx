import React, { useState } from "react";
import classnames from "classnames";
import Media from "@bmi/media";
import Typography from "@bmi/typography";
import Truncate from "@bmi/truncate";
import DesktopThumbnails from "./_DesktopThumbnails";
import MobileThumbnails from "./_MobileThumbnails";
import { Media as MediaData } from "./types";
import styles from "./MediaGallery.module.scss";

type Props = {
  media: readonly MediaData[];
  mediaSize?: "cover" | "contain";
  thumbnailComponent?: React.ComponentType<any>; // TODO
  layout?: "default" | "short";
  className?: string;
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
  let isTouchDevice =
    typeof document !== `undefined` &&
    "ontouchstart" in document.documentElement;
  const Thumbnails = isTouchDevice ? MobileThumbnails : DesktopThumbnails;

  return (
    <div className={classnames(styles["MediaGallery"], className)}>
      <div className={styles["image-wrapper"]}>
        {/* eslint-disable-next-line security/detect-object-injection */}
        {renderMedia(media[activeImageIndex], mediaSize, layout)}
        {/* eslint-disable-next-line security/detect-object-injection */}
        {media[activeImageIndex].caption ? (
          <div className={styles["caption"]}>
            <Typography
              variant="h6"
              component="p"
              className={styles["caption-text"]}
            >
              <Truncate lines="2">
                {
                  // eslint-disable-next-line security/detect-object-injection
                  (media[activeImageIndex] &&
                    // eslint-disable-next-line security/detect-object-injection
                    media[activeImageIndex].caption) ||
                    ""
                }
              </Truncate>
            </Typography>
          </div>
        ) : null}
      </div>
      {media.length > 1 && (
        <Thumbnails
          images={media}
          component={thumbnailComponent}
          activeImageIndex={activeImageIndex}
          onThumbnailClick={setActiveImageIndex}
        />
      )}
    </div>
  );
};
export default MediaGallery;
