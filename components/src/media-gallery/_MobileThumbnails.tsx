import classnames from "classnames";
import React, { useEffect, useRef, useState } from "react";
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
        classes.root,
        classes.touch,
        visibleGradients.left && classes.leftGradient,
        visibleGradients.right && classes.rightGradient
      )}
      onScroll={handleOnScroll}
      data-testid={"thumbnails-root"}
    >
      <div
        className={classes.scroller}
        ref={thumbnailsRef}
        style={{
          width: `${mediaData.length * THUMBNAIL_WIDTH}px`
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
                className={classes.thumbnail}
                size="large"
                altText={altText}
                isVideo={isVideo}
                openYoutubeVideo={(e: React.MouseEvent<SVGElement>) =>
                  openYoutubeVideo && openYoutubeVideo(e, index)
                }
                visualiserParameters={visualiserParameters}
                data-testid="default-thumbnail"
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default Thumbnails;
