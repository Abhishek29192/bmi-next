import Grid from "@bmi-digital/components/grid";
import MediaGallery, { MediaData } from "@bmi-digital/components/media-gallery";
import ProductOverviewPane, {
  ProductOverviewPaneProps
} from "@bmi-digital/components/product-overview-pane";
import DefaultImage from "@bmi-digital/components/resources/DefaultImage";
import Tag from "@bmi-digital/components/tag";
import Thumbnail, { ThumbnailProps } from "@bmi-digital/components/thumbnail";
import { microCopy } from "@bmi/microcopies";
import React, { useContext } from "react";
import type { GoodBetterBest } from "@bmi/pim-types";
import { useConfig } from "../contexts/ConfigProvider";
import {
  getLevel,
  goodBetterBestLabels
} from "../utils/getGoodBetterBestLabel";
import withGTM from "../utils/google-tag-manager";
import BrandLogo from "./BrandLogo";
import { useSiteContext } from "./Site";
import { VisualiserContext } from "./Visualiser";
import {
  StyledProductOverview,
  StyledRecaptchaPrivacyLinks
} from "./styles/ProductOverview.styles";
import tilesSetData from "./visualiser/data/tiles.json";

export type Data = {
  name: string;
  brandCode?: string;
  nobb: string | null;
  images: readonly MediaData[] | null;
  attributes: ProductOverviewPaneProps["attributes"] | null;
  variantCode: string;
  isRecaptchaShown?: boolean;
  videos?: MediaData[];
  isNavigationToVisualiserAvailable: boolean;
  goodBetterBest?: GoodBetterBest;
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
    isNavigationToVisualiserAvailable,
    goodBetterBest
  },
  children
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const { open: openVisualiser } = useContext(VisualiserContext);
  const { isV2VisualiserEnabled } = useConfig();

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
  const media: MediaData[] = [...(images || []), ...(videos || [])];

  if (visualiserMedia && images) {
    media.push({
      ...visualiserMedia,
      ...images[0]
    });
  }

  if (media.length === 0) {
    media.push({ media: { component: DefaultImage } });
  }

  return (
    <StyledProductOverview data-testid={"product-overview"}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12} lg={8}>
          <MediaGallery
            media={media}
            thumbnailComponent={(props: ThumbnailProps) => (
              <GTMMediaThumbnail gtm={{ id: "media-gallery1" }} {...props} />
            )}
            layout="short"
            videoButtonLabel={getMicroCopy(microCopy.MEDIA_VIDEO)}
            visualiserButtonLabel={getMicroCopy(microCopy.MEDIA_3D)}
            visualiserText={getMicroCopy(microCopy.MEDIA_VISUALIZER_TEXT)}
            tag={
              goodBetterBest && (
                <Tag
                  level={getLevel(goodBetterBest)}
                  // eslint-disable-next-line security/detect-object-injection
                  label={getMicroCopy(goodBetterBestLabels[goodBetterBest])}
                  rounded
                />
              )
            }
          />
        </Grid>
        <Grid xs={12} md={12} lg={4}>
          <ProductOverviewPane
            brandLogo={
              brandCode ? <BrandLogo brandName={brandCode} /> : undefined
            }
            name={name}
            nobb={nobb}
            thumbnailComponent={(props: ThumbnailProps) => (
              <GTMThumbnail gtm={{ id: "thumbnail1" }} {...props} />
            )}
            nobbLabel={getMicroCopy(microCopy.PDP_NOBB_LABEL)}
            attributes={attributes || []}
          >
            {children}
          </ProductOverviewPane>
          {isRecaptchaShown && <StyledRecaptchaPrivacyLinks />}
        </Grid>
      </Grid>
    </StyledProductOverview>
  );
};

export default ProductOverview;
