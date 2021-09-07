import React from "react";
import { useTranslation } from "react-i18next";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@bmi/typography";
import { GetMediaFolderContentsQuery } from "../../graphql/generated/operations";
import { MediaTileThumbnail } from "./Thumbnail";
import styles from "./styles.module.scss";

type MediaItem =
  GetMediaFolderContentsQuery["mediaFolder"]["childrenCollection"]["items"][0];

export type MediaTileProps = {
  mediaItem: MediaItem;
  onMediaItemClick: (id: string) => any;
};

const META_TYPES = {
  FOLDER: "FOLDER",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  EXTERNAL_LINK: "EXTERNAL_LINK",
  PDF: "PDF",
  FALLBACK: "MEDIA"
};

const getItemMeta = (mediaItem: MediaItem) => {
  if (mediaItem.__typename === "MediaFolder") {
    return META_TYPES.FOLDER;
  }
  if (mediaItem.url) {
    return META_TYPES.EXTERNAL_LINK;
  }
  const contentType = mediaItem.media?.contentType;
  if (!contentType) {
    return META_TYPES.FALLBACK;
  }
  if (contentType.includes("image")) {
    return META_TYPES.IMAGE;
  }
  if (contentType.includes("pdf")) {
    return META_TYPES.PDF;
  }
  if (contentType.includes("video")) {
    return META_TYPES.VIDEO;
  }
  return META_TYPES.FALLBACK;
};

export const MediaTile = ({ mediaItem, onMediaItemClick }: MediaTileProps) => {
  const { t } = useTranslation("toolkit");
  return (
    <div>
      <div className="content">
        <div className="outlined">
          <CardActionArea
            onClick={() => {
              onMediaItemClick(mediaItem.sys.id);
            }}
          >
            <CardContent className={styles.content}>
              <MediaTileThumbnail mediaItem={mediaItem} />
            </CardContent>
          </CardActionArea>
        </div>

        <div className={styles.footer}>
          <Typography variant="button" className={styles.title}>
            {mediaItem.name}
          </Typography>

          <Typography variant="button" className={styles.meta}>
            {t(`contentTypes.${getItemMeta(mediaItem)}`)}
          </Typography>
        </div>
      </div>
    </div>
  );
};
