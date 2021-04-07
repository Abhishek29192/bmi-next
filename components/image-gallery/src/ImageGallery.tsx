import React, { useState } from "react";
import classnames from "classnames";
import Media from "@bmi/media";
import Typography from "@bmi/typography";
import Truncate from "@bmi/truncate";
import DesktopThumbnails from "./_DesktopThumbnails";
import MobileThumbnails from "./_MobileThumbnails";
import { Image } from "./types";
import styles from "./ImageGallery.module.scss";

type Props = {
  images: Image[];
  imageSize?: "cover" | "contain";
  thumbnailComponent?: React.ComponentType<any>; // TODO
  layout?: "default" | "short";
};

const renderMedia = (
  { mainSource, altText, media }: Image,
  imageSize: Props["imageSize"],
  layout?: Props["layout"]
) => {
  const className = classnames(
    styles["main-image-wrapper"],
    {
      [styles[`main-image-wrapper--${imageSize}`]]: imageSize !== "contain"
    },
    styles[`main-image-wrapper--${layout}`]
  );

  if (mainSource && altText) {
    // TODO: Deprecate this case.
    return (
      <div
        className={className}
        style={{
          backgroundImage: `url(${mainSource})`
        }}
      >
        <span className={styles["accessibility-label"]}>{altText}</span>
      </div>
    );
  }

  if (media) {
    return (
      <Media size={imageSize} className={className}>
        {media}
      </Media>
    );
  }

  return null;
};

const ImageGallery = ({
  images,
  imageSize = "contain",
  thumbnailComponent,
  layout = "default"
}: Props) => {
  if (!images.length) {
    return null;
  }

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  let isTouchDevice =
    typeof document !== `undefined` &&
    "ontouchstart" in document.documentElement;

  const Thumbnails = isTouchDevice ? MobileThumbnails : DesktopThumbnails;

  return (
    <div className={styles["ImageGallery"]}>
      <div className={styles["image-wrapper"]}>
        {renderMedia(images[activeImageIndex], imageSize, layout)}
        {images[activeImageIndex].caption ? (
          <div className={styles["caption"]}>
            <Typography
              variant="h6"
              component="p"
              className={styles["caption-text"]}
            >
              <Truncate lines="2">{images[activeImageIndex].caption}</Truncate>
            </Typography>
          </div>
        ) : null}
      </div>
      {images.length > 1 && (
        <Thumbnails
          images={images}
          component={thumbnailComponent}
          activeImageIndex={activeImageIndex}
          onThumbnailClick={setActiveImageIndex}
        />
      )}
    </div>
  );
};

export default ImageGallery;
