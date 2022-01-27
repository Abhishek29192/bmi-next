import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import DefaultThumbnail from "@bmi/thumbnail";
import styles from "./MediaGallery.module.scss";
import { Media as MediaData } from "./types";

type Props = {
  images: readonly MediaData[];
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
    const parentElement =
      thumbnailsRef.current && thumbnailsRef.current.parentElement;
    const parentScrollLeft = parentElement!.scrollLeft || 0;
    const parentOffsetWidth = parentElement!.offsetWidth || 0;
    const offsetWidth =
      (thumbnailsRef.current && thumbnailsRef.current.offsetWidth) || 0;

    clearTimeout(debouncer);

    debouncer = setTimeout(() => {
      setVisibleGradients({
        left: parentScrollLeft > 0,
        right: parentScrollLeft < offsetWidth - parentOffsetWidth
      });
    }, 50);
  };

  useEffect(() => {
    const currentElement = thumbnailsRef.current;
    const scrollTo = currentElement && currentElement.parentElement!.scrollTo;
    if (scrollTo) {
      scrollTo({
        left: (currentElement && currentElement.offsetWidth) || undefined
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
        {images.map(({ thumbnail, isVideo }, index) => {
          return (
            <Thumbnail
              key={`thumbnail-${index}`}
              imageSource={thumbnail}
              state={activeImageIndex === index ? "selected" : "enabled"}
              onClick={() => onThumbnailClick(index)}
              className={styles["thumbnail"]}
              size="large"
              isVideo={isVideo}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Thumbnails;
