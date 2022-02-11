import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import DefaultThumbnail from "@bmi/thumbnail";
import { StateEnum, SizeEnum } from "../../thumbnail/src/Thumbnail";
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
    currentElement &&
      currentElement.parentElement!.scrollTo({
        left: (currentElement && currentElement.offsetWidth) || undefined
      });

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
        {images.map(({ media, thumbnail, altText }, index) => {
          return (
            <Thumbnail
              media={media}
              key={`thumbnail-${index}`}
              imageSource={thumbnail}
              altText={altText}
              state={
                activeImageIndex === index
                  ? StateEnum.SELECTED
                  : StateEnum.ENABLED
              }
              onClick={() => onThumbnailClick(index)}
              className={styles["thumbnail"]}
              size={SizeEnum.LARGE}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Thumbnails;
