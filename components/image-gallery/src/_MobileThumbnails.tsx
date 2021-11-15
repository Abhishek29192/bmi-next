import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import DefaultThumbnail from "@bmi/thumbnail";
import styles from "./ImageGallery.module.scss";
import { Image } from "./types";

type Props = {
  images: readonly Image[];
  /** The index to identify the active thumbnail */
  activeImageIndex: number;
  onThumbnailClick: (index: number) => void;
  component?: React.ComponentType<any>; // TODO
};

const THUMBNAIL_WIDTH = 86;

const Thumbnails = ({
  images,
  activeImageIndex,
  onThumbnailClick,
  component: Thumbnail = DefaultThumbnail
}: Props) => {
  let debouncer: NodeJS.Timeout;
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [visibleGradients, setVisibleGradients] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: false, right: false });

  const handleOnScroll = () => {
    clearTimeout(debouncer);

    debouncer = setTimeout(() => {
      setVisibleGradients({
        left: (thumbnailsRef?.current?.parentElement?.scrollLeft || 0) > 0,
        right:
          (thumbnailsRef?.current?.parentElement?.scrollLeft || 0) <
          (thumbnailsRef?.current?.offsetWidth || 0) -
            (thumbnailsRef?.current?.parentElement?.offsetWidth || 0)
      });
    }, 50);
  };

  useEffect(() => {
    if (thumbnailsRef.current) {
      thumbnailsRef.current.parentElement?.scrollTo({
        left: thumbnailsRef.current.offsetWidth
      });
    }

    return () => {
      clearTimeout(debouncer);
    };
  }, [thumbnailsRef.current]);

  return (
    <div
      className={classnames(
        styles["thumbnails"],
        styles["thumbnails--touch"],
        visibleGradients.left && styles["thumbnails--left-gradient"],
        visibleGradients.right && styles["thumbnails--right-gradient"]
      )}
      onScroll={handleOnScroll}
    >
      <div
        className={styles["scroller"]}
        ref={thumbnailsRef}
        style={{
          width: `${images.length * THUMBNAIL_WIDTH}px`
        }}
      >
        {images.map(({ mainSource, thumbnail, altText }, index) => {
          return (
            <Thumbnail
              key={`thumbnail-${index}`}
              imageSource={thumbnail || mainSource}
              altText={altText}
              state={activeImageIndex === index ? "selected" : "enabled"}
              onClick={() => onThumbnailClick(index)}
              className={styles["thumbnail"]}
              size="large"
            />
          );
        })}
      </div>
    </div>
  );
};

export default Thumbnails;
