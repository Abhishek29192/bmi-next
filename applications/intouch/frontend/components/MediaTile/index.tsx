import React, { useMemo, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@bmi/components";
import { Account } from "@bmi/intouch-api-types";
import { MediaItem } from "../../lib/media/types";
import {
  getMediaItemMeta,
  getMediaItemSize,
  isExternalLink
} from "../../lib/media/utils";
import { Link } from "../Link";
import can from "../../lib/permissions/can";
import { MediaTileThumbnail } from "./Thumbnail";
import styles from "./styles.module.scss";

export type MediaTileProps = {
  mediaItem: MediaItem;
  onMediaItemClick: (mediaItem: MediaItem) => any;
  account: Account;
  merchandiseSso: boolean;
};

const MERCHANDISE_SSO_URL = "/api/merchandise-sso";
const SSO_TYPE = "MERCHANDISE";

const MediaTileWrapper = ({
  isExternal,
  url,
  cta,
  children,
  account,
  merchandiseSso
}: {
  isExternal: boolean;
  url?: string;
  cta?: string;
  children: ReactNode;
  account: Account;
  merchandiseSso: boolean;
}) => {
  if (
    (cta == SSO_TYPE && !can(account, "home", "MerchandiseSso")) ||
    !merchandiseSso
  ) {
    return <div>{children}</div>;
  }

  return isExternal || cta == SSO_TYPE ? (
    <Link isExternal href={cta != SSO_TYPE ? url : MERCHANDISE_SSO_URL}>
      {children}
    </Link>
  ) : (
    <div>{children}</div>
  );
};

export const MediaTile = ({
  mediaItem,
  onMediaItemClick,
  account,
  merchandiseSso
}: MediaTileProps) => {
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
    <MediaTileWrapper
      isExternal={isExternal}
      url={mediaUrl}
      cta={mediaItem?.cta}
      account={account}
      merchandiseSso={merchandiseSso}
    >
      <div className="content">
        <CardActionArea
          onClick={() => {
            onMediaItemClick(mediaItem);
          }}
        >
          <div className="outlined">
            <CardContent className={styles.content}>
              <MediaTileThumbnail mediaItem={mediaItem} />
            </CardContent>
          </div>

          <div className={styles.footer}>
            <Typography variant="button" className={styles.title}>
              {mediaItem.name}
            </Typography>

            <Typography variant="button" className={styles.meta}>
              {mediaTileDescription}
            </Typography>
          </div>
        </CardActionArea>
      </div>
    </MediaTileWrapper>
  );
};
