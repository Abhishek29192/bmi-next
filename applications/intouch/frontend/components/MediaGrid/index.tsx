import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@bmi/typography";
import { GetMediaItemByIdQuery } from "../../graphql/generated/operations";
import { MediaItem } from "../../lib/media/types";
import { MediaTile } from "../MediaTile";
import styles from "./styles.module.scss";

export type MediaGridProps = {
  isLoading: boolean;
  items: GetMediaItemByIdQuery["mediaFolderCollection"]["items"][0]["childrenCollection"]["items"];
  totalNumItems: number;
  onMediaItemClick: (mediaItem: MediaItem) => any;
};

// TODO: NoContent as per design
const EmptyFolder = () => <p>Nothing here</p>;

export const MediaGrid = ({
  isLoading,
  items,
  totalNumItems,
  onMediaItemClick
}: MediaGridProps) => {
  if (items.length === 0) {
    return <EmptyFolder />;
  }
  return (
    <div className={styles.mediaGrid}>
      <div className={styles.meta}>
        <Typography variant="subtitle2" display="block">
          Showing {items.length} of {totalNumItems} items
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
