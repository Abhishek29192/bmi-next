import React, { useRef, useState, useEffect } from "react";
import classnames from "classnames";
import Thumbnail from "@bmi/thumbnail";
import ThumbScrollerButton from "@bmi/thumb-scroller-button";
import { Image } from "./types";
import styles from "./ImageGallery.module.scss";

type Props = {
  images: Image[];
  /** The index to identify the active thumbnail */
  activeImageIndex: number;
  onThumbnailClick: (index: number) => void;
};

const THUMBNAIL_WIDTH = 86;

const Thumbnails = ({ images, activeImageIndex, onThumbnailClick }: Props) => {
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [visibleArrows, setVisibleArrows] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: false, right: false });
  const [scrollerPosition, setScrollerPosition] = useState<number>(0);
  const thumbnailsWidth = images.length * THUMBNAIL_WIDTH;

  const handleThumbScrollerClick = (direction: "left" | "right") => {
    if (!thumbnailsRef.current || isTransitioning) {
      return;
    }
    setIsTransitioning(true);

    setScrollerPosition((scrollerPosition) => {
      if (direction === "right") {
        return scrollerPosition + Math.min(100, Math.abs(scrollerPosition));
      }

      const thumbnailsElement = thumbnailsRef.current;
      const wrapperWidth = thumbnailsElement.parentElement.offsetWidth;
      const scrollerPositionPixels =
        (wrapperWidth * Math.abs(scrollerPosition)) / 100;
      const offset = thumbnailsWidth - (wrapperWidth + scrollerPositionPixels);
      const nextMargin = Math.min(100, (offset * 100) / wrapperWidth);

      return scrollerPosition - nextMargin;
    });
  };

  const calculateLeftRightVisibility = () => {
    if (!thumbnailsRef.current) {
      return;
    }

    const thumbnailsElement = thumbnailsRef.current;
    const isRightArrowVisible = scrollerPosition < 0;
    const isLeftArrowVisible = thumbnailsElement.offsetWidth < thumbnailsWidth;

    setVisibleArrows({
      left: isLeftArrowVisible,
      right: isRightArrowVisible
    });
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    calculateLeftRightVisibility();
  };

  useEffect(() => {
    calculateLeftRightVisibility();
  }, [thumbnailsRef.current]);

  return (
    <div className={styles["thumbnails"]}>
      <ThumbScrollerButton
        direction="left"
        className={classnames(
          styles["thumb-scroller"],
          styles["thumb-scroller--left"],
          {
            [styles["thumb-scroller--hidden"]]: !visibleArrows.left
          }
        )}
        onClick={() => handleThumbScrollerClick("left")}
      />
      <ThumbScrollerButton
        direction="right"
        className={classnames(
          styles["thumb-scroller"],
          styles["thumb-scroller--right"],
          {
            [styles["thumb-scroller--hidden"]]: !visibleArrows.right
          }
        )}
        onClick={() => handleThumbScrollerClick("right")}
      />
      <div
        className={styles["scroller"]}
        ref={thumbnailsRef}
        onTransitionEnd={handleTransitionEnd}
        style={{
          marginRight: `${scrollerPosition}%`
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
