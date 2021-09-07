import React from "react";
import Icon from "@bmi/icon";
import { Folder, PlayArrow } from "@material-ui/icons";
import { BMI } from "@bmi/logo";
import { GetMediaFolderContentsQuery } from "../../graphql/generated/operations";
import styles from "./styles.module.scss";

type Props = {
  mediaItem: GetMediaFolderContentsQuery["mediaFolder"]["childrenCollection"]["items"][0];
};

export const MediaTileThumbnail = ({ mediaItem }: Props) => {
  if (mediaItem.__typename === "MediaFolder") {
    return <Icon source={Folder} style={{ fontSize: 64 }} color="primary" />;
  }

  // precedence always to thumbnails uploaded by the market admin
  if (mediaItem?.thumbnail) {
    return (
      <img
        src={mediaItem?.thumbnail?.url}
        className={styles.thumbnail}
        alt={mediaItem.thumbnail?.title}
      />
    );
  }

  const externalMediaUrl = mediaItem?.url;

  if (externalMediaUrl?.includes("vimeo")) {
    return (
      <div style={{ position: "relative" }}>
        <img src={externalMediaUrl} className={styles.videoTile} alt="" />
        <div className={styles.playButton}>
          <Icon
            source={PlayArrow}
            style={{ fontSize: "2rem", display: "block" }}
            color="primary"
          />
        </div>
      </div>
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
