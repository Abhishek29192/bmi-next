import classnames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import ThumbScrollerButton from "../thumb-scroller-button/ThumbScrollerButton";
import DefaultThumbnail from "../thumbnail/Thumbnail";
import { useThumbnailStyles } from "./styles";
import { ThumbnailsProps } from "./types";

const THUMBNAIL_WIDTH = 86;

const Thumbnails = ({
  media: mediaData,
  activeImageIndex,
  onThumbnailClick,
  openYoutubeVideo,
  component: Thumbnail = DefaultThumbnail
}: ThumbnailsProps) => {
  const classes = useThumbnailStyles();
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [visibleArrows, setVisibleArrows] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: false, right: false });
  const [scrollerPosition, setScrollerPosition] = useState<number>(0);
  const thumbnailsWidth = mediaData.length * THUMBNAIL_WIDTH;

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
    <div className={classes.root} data-testid={"thumbnails-root"}>
      <ThumbScrollerButton
        direction="left"
        className={classnames(
          classes.thumbScroller,
          classes.thumbScrollerLeft,
          !visibleArrows.left && classes.thumbScrollerHidden
        )}
        onClick={() => handleThumbScrollerClick("left")}
        data-testid={"thumbnail-scroller-left"}
      />
      <ThumbScrollerButton
        direction="right"
        className={classnames(
          classes.thumbScroller,
          classes.thumbScrollerRight,
          !visibleArrows.right && classes.thumbScrollerHidden
        )}
        onClick={() => handleThumbScrollerClick("right")}
        data-testid={"thumbnail-scroller-right"}
      />
      <div
        className={classes.scroller}
        ref={thumbnailsRef}
        onTransitionEnd={handleTransitionEnd}
        style={{
          marginRight: `${scrollerPosition}%`
        }}
        data-testid={"thumbnail-scroller"}
      >
        {mediaData.map(
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
                className={classes.thumbnail}
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
