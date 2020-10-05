import React, { useState } from "react";
import styles from "./ImageGallery.module.scss";
import DesktopThumbnails from "./_DesktopThumbnails";
import MobileThumbnails from "./_MobileThumbnails";
import { Image } from "./types";

type Props = {
  images: Image[];
};

const ImageGallery = ({ images }: Props) => {
  if (!images.length) {
    return null;
  }

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  let isTouchDevice = document && "ontouchstart" in document.documentElement;

  const Thumbnails = isTouchDevice ? MobileThumbnails : DesktopThumbnails;

  return (
    <div className={styles["ImageGallery"]}>
      <div
        className={styles["main-image-wrapper"]}
        style={{
          backgroundImage: `url(${images[activeImageIndex].mainSource})`
        }}
      >
        <span className={styles["accessibility-label"]}>
          {images[activeImageIndex].altText}
        </span>
      </div>
      <Thumbnails
        images={images}
        activeImageIndex={activeImageIndex}
        onThumbnailClick={setActiveImageIndex}
      />
    </div>
  );
};

export default ImageGallery;
