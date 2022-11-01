import {
  Grid,
  MediaData,
  MediaGallery,
  ProductOverviewPane,
  ProductOverviewPaneProps,
  Thumbnail,
  ThumbnailProps
} from "@bmi-digital/components";
import React, { useContext } from "react";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import DefaultImage from "../images/DefaultImage.svg";
import withGTM from "../utils/google-tag-manager";
import { iconMap } from "./Icon";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";
import { useSiteContext } from "./Site";
import styles from "./styles/ProductOverview.module.scss";
import { VisualiserContext } from "./Visualiser";
import tilesSetData from "./visualiser/data/tiles.json";

export type Data = {
  name: string;
  brandCode: string;
  nobb: string | null;
  images: readonly MediaData[];
  attributes: ProductOverviewPaneProps["attributes"] | null;
  variantCode: string;
  isRecaptchaShown?: boolean;
  videos?: MediaData[];
  isNavigationToVisualiserAvailable: boolean;
};

type Props = {
  data: Data;
  children?: React.ReactNode;
};

const GTMThumbnail = withGTM<ThumbnailProps>(Thumbnail, {
  action: "imageSource",
  label: "altText"
});

const GTMMediaThumbnail = withGTM<ThumbnailProps>(Thumbnail, {
  label: "media",
  action: "media"
});

const ProductOverview = ({
  data: {
    name,
    brandCode,
    nobb,
    images,
    attributes,
    isRecaptchaShown,
    videos = [],
    variantCode,
    isNavigationToVisualiserAvailable
  },
  children
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const { open: openVisualiser } = useContext(VisualiserContext);
  const {
    config: { isV2VisualiserEnabled }
  } = useConfig();

  const getVisualiserMedia = () => {
    if (isV2VisualiserEnabled && !isNavigationToVisualiserAvailable) {
      return;
    }

    for (let index = 0; index < tilesSetData.tiles.length; index++) {
      if (isV2VisualiserEnabled) {
        return {
          visualiserParameters: {
            colourId: "",
            sidingId: 1,
            tileId: variantCode,
            viewMode: "roof",
            caption: getMicroCopy(microCopy.PDP_VISUALISER_SLIDE_CAPTION)
          },
          openVisualiser
        };
      }

      const tile = tilesSetData.tiles[Number(index)];
      const tileColor = tile.colours.find(
        (color) => color.variantCode === variantCode
      );

      if (tileColor) {
        return {
          visualiserParameters: {
            colourId: tileColor.id,
            sidingId: 1,
            tileId: tile.id,
            viewMode: "roof",
            caption: getMicroCopy(microCopy.PDP_VISUALISER_SLIDE_CAPTION)
          },
          openVisualiser
        };
      }
    }
  };

  const visualiserMedia = getVisualiserMedia();
  const media: MediaData[] = [...images, ...videos];

  if (visualiserMedia) {
    media.push({
      ...visualiserMedia,
      ...images[0]
    });
  }

  if (media.length === 0) {
    media.push({ media: <DefaultImage /> });
  }

  return (
    <div className={styles["ProductOverview"]}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={8}>
          <MediaGallery
            media={media}
            thumbnailComponent={(props: ThumbnailProps) => (
              <GTMMediaThumbnail gtm={{ id: "media-gallery1" }} {...props} />
            )}
            layout="short"
          />
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <ProductOverviewPane
            // eslint-disable-next-line security/detect-object-injection
            brandLogo={iconMap[brandCode]}
            name={name}
            nobb={nobb}
            thumbnailComponent={(props: ThumbnailProps) => (
              <GTMThumbnail gtm={{ id: "thumbnail1" }} {...props} />
            )}
            nobbLabel={getMicroCopy(microCopy.PDP_NOBB_LABEL)}
            attributes={attributes}
          >
            {children}
          </ProductOverviewPane>
          {isRecaptchaShown && (
            <RecaptchaPrivacyLinks
              className={styles["keyAssetTypesDownload"]}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductOverview;
