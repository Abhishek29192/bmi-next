import React from "react";
import {
  Grid,
  MediaData,
  MediaGallery,
  ProductOverviewPane,
  ProductOverviewPaneProps,
  Thumbnail,
  ThumbnailProps
} from "@bmi/components";
import withGTM from "../utils/google-tag-manager";
import { microCopy } from "../constants/microCopies";
import styles from "./styles/ProductOverview.module.scss";
import { iconMap } from "./Icon";
import { useSiteContext } from "./Site";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";

export type Data = {
  name: string;
  brandCode: string;
  nobb: string | null;
  images: readonly MediaData[];
  attributes: ProductOverviewPaneProps["attributes"];
  isRecaptchaShown?: boolean;
  videos?: MediaData[];
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
    videos = []
  },
  children
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <div className={styles["ProductOverview"]}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={8}>
          <MediaGallery
            media={[...images, ...videos]}
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
