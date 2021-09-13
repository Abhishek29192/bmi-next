import React, { useMemo, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@bmi/typography";
import { MediaItem } from "../../lib/media/types";
import {
  getMediaItemMeta,
  getMediaItemSize,
  isExternalLink
} from "../../lib/media/utils";
import { Link } from "../Link";
import { MediaTileThumbnail } from "./Thumbnail";
import styles from "./styles.module.scss";

export type MediaTileProps = {
  mediaItem: MediaItem;
  onMediaItemClick: (mediaItem: MediaItem) => any;
};

const MediaTileWrapper = ({
  isExternal,
  url,
  children
}: {
  isExternal: boolean;
  url?: string;
  children: ReactNode;
}) =>
  isExternal ? (
    <Link isExternal href={url}>
      {children}
    </Link>
  ) : (
    <div>{children}</div>
  );

export const MediaTile = ({ mediaItem, onMediaItemClick }: MediaTileProps) => {
  const { t } = useTranslation("toolkit");

  const mediaTileDescription = useMemo(() => {
    return [
      getMediaItemSize(mediaItem),
      t(`contentTypes.${getMediaItemMeta(mediaItem)}`)
    ]
      .filter(Boolean)
      .join(" • ");
  }, [t, mediaItem]);

  const isExternal = useMemo(() => isExternalLink(mediaItem), [mediaItem]);
  const mediaUrl = useMemo(
    () => (mediaItem.__typename === "MediaTool" ? mediaItem.url : undefined),
    [mediaItem]
  );

  return (
    <MediaTileWrapper isExternal={isExternal} url={mediaUrl}>
      <div className="content">
        <div className="outlined">
          <CardActionArea
            onClick={() => {
              onMediaItemClick(mediaItem);
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
            {mediaTileDescription}
          </Typography>
        </div>
      </div>
    </MediaTileWrapper>
  );
};
