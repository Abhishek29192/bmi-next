import classnames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import ThumbScrollerButton from "../thumb-scroller-button/ThumbScrollerButton";
import DefaultThumbnail from "../thumbnail/Thumbnail";
import styles from "./MediaGallery.module.scss";
import { Media as MediaData } from "./types";

type Props = {
  images: readonly MediaData[];
  /** The index to identify the active thumbnail */
  activeImageIndex: number;
  onThumbnailClick: (e: Event, index: number) => void;
  openYoutubeVideo?: (e: React.MouseEvent<SVGElement>, index: number) => void;
  component?: React.ComponentType<any>; // TODO
};

const THUMBNAIL_WIDTH = 86;

const Thumbnails = ({
  images,
  activeImageIndex,
  onThumbnailClick,
  openYoutubeVideo,
  component: Thumbnail = DefaultThumbnail
}: Props) => {
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
      const parentElement = thumbnailsRef.current!.parentElement;
      const wrapperWidth = parentElement!.offsetWidth || 0;
      const scrollerPositionPixels =
        (wrapperWidth * Math.abs(scrollerPosition)) / 100;
      const offset = thumbnailsWidth - (wrapperWidth + scrollerPositionPixels);
      const nextMargin = Math.min(100, (offset * 100) / wrapperWidth);
      return scrollerPosition - nextMargin;
    });
  };

  const calculateLeftRightVisibility = () => {
    const parentElement =
      thumbnailsRef.current && thumbnailsRef.current.parentElement;
    if (!parentElement) {
      return;
    }
    const wrapperWidth = parentElement!.offsetWidth || 0;
    const isRightArrowVisible = scrollerPosition < 0;
    const isLeftArrowVisible = wrapperWidth < thumbnailsWidth || false;
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
          !visibleArrows.left && styles["thumb-scroller--hidden"]
        )}
        onClick={() => handleThumbScrollerClick("left")}
      />
      <ThumbScrollerButton
        direction="right"
        className={classnames(
          styles["thumb-scroller"],
          styles["thumb-scroller--right"],
          !visibleArrows.right && styles["thumb-scroller--hidden"]
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
        {images.map(
          (
            { thumbnail, isVideo, altText, media, visualiserParameters },
            index
          ) => {
            return (
              <Thumbnail
                media={media}
                key={`thumbnail-${index}`}
                imageSource={thumbnail}
                state={activeImageIndex === index ? "selected" : "enabled"}
                onClick={(e: Event) => onThumbnailClick(e, index)}
                altText={altText}
                className={styles["thumbnail"]}
                size="large"
                isVideo={isVideo}
                openYoutubeVideo={(e: React.MouseEvent<SVGElement>) =>
                  openYoutubeVideo && openYoutubeVideo(e, index)
                }
                visualiserParameters={visualiserParameters}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default Thumbnails;