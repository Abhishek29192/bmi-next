import React, { useState } from "react";
import classnames from "classnames";
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
      <div
        className={classnames(
          styles["main-image-wrapper"],
          {
            [styles[`main-image-wrapper--${imageSize}`]]:
              imageSize !== "contain"
          },
          styles[`main-image-wrapper--${layout}`]
        )}
        style={{
          backgroundImage: `url(${images[activeImageIndex].mainSource})`
        }}
      >
        <span className={styles["accessibility-label"]}>
          {images[activeImageIndex].altText}
        </span>
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
