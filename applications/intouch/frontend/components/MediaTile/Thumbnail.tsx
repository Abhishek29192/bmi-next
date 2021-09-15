import React from "react";
import Icon from "@bmi/icon";
import { Folder, PlayArrow } from "@material-ui/icons";
import { BMI } from "@bmi/logo";
import { resizeContentfulImage, getVimeoEmbedUrl } from "../../lib/media/utils";
import { MediaItem } from "../../lib/media/types";
import styles from "./styles.module.scss";

type Props = {
  mediaItem: MediaItem;
};

const THUMBNAIL_MAX_WIDTH = 300;

const VimeoIFrameThumbnail = ({ videoUrl }: { videoUrl: string }) => (
  <div>
    <iframe
      src={`${getVimeoEmbedUrl(
        videoUrl
      )}?title=0&portrait=0&controls=0&sidedock=0`}
      height="100%"
      width="100%"
      scrolling="yes"
      frameBorder="0"
      className={styles.iframe}
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

export const MediaTileThumbnail = ({ mediaItem }: Props) => {
  if (mediaItem.__typename === "MediaFolder") {
    return <Icon source={Folder} style={{ fontSize: 64 }} color="primary" />;
  }
  // precedence always to thumbnails uploaded by the market admin
  if (mediaItem?.thumbnail) {
    return (
      <img
        src={resizeContentfulImage(
          mediaItem?.thumbnail?.url,
          THUMBNAIL_MAX_WIDTH
        )}
        className={styles.thumbnail}
        alt={mediaItem.thumbnail?.title}
      />
    );
  }
  const externalMediaUrl = mediaItem?.url;
  if (externalMediaUrl?.includes("vimeo")) {
    // Vimeo doesn't provide a thumbnail url without making an additional request to Vimeo
    // rendering an iframe without controls to avoid making the extra request
    return <VimeoIFrameThumbnail videoUrl={externalMediaUrl} />;
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
