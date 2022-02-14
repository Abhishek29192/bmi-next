import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@bmi-digital/components/typography";
import { useTranslation } from "react-i18next";
import { MediaFolder, MediaItem } from "../../lib/media/types";
import { MediaTile } from "../MediaTile";
import styles from "./styles.module.scss";

export type MediaGridProps = {
  isLoading: boolean;
  items: MediaFolder["childrenCollection"]["items"];
  totalNumItems: number;
  onMediaItemClick: (mediaItem: MediaItem) => any;
};

export const MediaGrid = ({
  isLoading,
  items,
  totalNumItems,
  onMediaItemClick
}: MediaGridProps) => {
  const { t } = useTranslation("toolkit");

  if (items.length === 0) {
    return <p>{t("noItems")}</p>;
  }

  return (
    <div className={styles.mediaGrid}>
      <div className={styles.meta}>
        <Typography variant="subtitle2" display="block">
          {t("countIndicator", { amount: items.length, total: totalNumItems })}
        </Typography>
      </div>
      <div>
        {isLoading && (
          <div className={styles.loading}>
            <CircularProgress size={200} color="primary" />
          </div>
        )}
        <div className={styles.tiles}>
          {items.map((mediaItem) => {
            return (
              <MediaTile
                key={mediaItem.sys?.id}
                mediaItem={mediaItem}
                onMediaItemClick={onMediaItemClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
