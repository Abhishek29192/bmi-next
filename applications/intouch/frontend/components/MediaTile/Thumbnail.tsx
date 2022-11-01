import { BMI, Icon } from "@bmi-digital/components";
import { Folder, PlayArrow } from "@material-ui/icons";
import React from "react";
import { MediaItem } from "../../lib/media/types";
import { getVimeoEmbedUrl, resizeContentfulImage } from "../../lib/media/utils";
import styles from "./styles.module.scss";

type Props = {
  mediaItem: MediaItem;
  optanonClass?: string;
};

const THUMBNAIL_MAX_WIDTH = 300;

const VimeoIFrameThumbnail = ({
  videoUrl,
  optanonClass,
  mediaItemClass
}: {
  videoUrl: string;
  optanonClass: string;
  mediaItemClass: string;
}) => (
  <div>
    <iframe
      src={`${getVimeoEmbedUrl(
        videoUrl
      )}?title=0&portrait=0&controls=0&sidedock=0`}
      height="100%"
      width="100%"
      scrolling="yes"
      frameBorder="0"
      className={`${styles.iframe} ${
        mediaItemClass?.length ? mediaItemClass : optanonClass
      }`}
      sandbox="allow-scripts allow-same-origin"
    />

    <div className={styles.playButton}>
      <Icon
        source={PlayArrow}
        style={{ fontSize: "2rem", display: "block" }}
        color="primary"
      />
    </div>
  </div>
);

export const MediaTileThumbnail = ({ mediaItem, optanonClass }: Props) => {
  if (mediaItem.__typename === "MediaFolder") {
    return <Icon source={Folder} style={{ fontSize: 64 }} color="primary" />;
  }
  // precedence always to thumbnails uploaded by the market admin
  if (mediaItem.thumbnail) {
    return (
      <img
        src={resizeContentfulImage(
          mediaItem.thumbnail.url,
          THUMBNAIL_MAX_WIDTH
        )}
        className={styles.thumbnail}
        alt={mediaItem.thumbnail.title}
      />
    );
  }
  const externalMediaUrl = mediaItem.url;
  const mediaItemClass = mediaItem.mediaItemClass;
  if (externalMediaUrl?.includes("vimeo")) {
    // Vimeo doesn't provide a thumbnail url without making an additional request to Vimeo
    // rendering an iframe without controls to avoid making the extra request
    return (
      <VimeoIFrameThumbnail
        videoUrl={externalMediaUrl}
        optanonClass={optanonClass}
        mediaItemClass={mediaItemClass}
      />
    );
  }
  // fallback icon
  return (
    <Icon
      source={BMI}
      style={{ width: 50, display: "block" }}
      color="primary"
    />
  );
};
