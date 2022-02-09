import React from "react";
import Grid from "@bmi/grid";
import ProductOverviewPane, {
  Props as ProductOverviewProps
} from "@bmi/product-overview-pane";
import ImageGallery, { Image } from "@bmi/image-gallery";
import Thumbnail, { Props as ThumbnailProps } from "@bmi/thumbnail";
import withGTM from "../utils/google-tag-manager";
import { microCopy } from "../constants/microCopies";
import styles from "./styles/ProductOverview.module.scss";
import { iconMap } from "./Icon";
import { useSiteContext } from "./Site";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";

export type Data = {
  name: string;
  brandName: string;
  nobb: string | null;
  images: readonly Image[];
  attributes: ProductOverviewProps["attributes"] | null;
  isRecapchaShown?: boolean;
};

const ProductOverview = ({
  data: { name, brandName, nobb, images, attributes, isRecapchaShown },
  children
}: {
  data: Data;
  children?: React.ReactNode;
}) => {
  const { getMicroCopy } = useSiteContext();

  const GTMThumbnail = withGTM<ThumbnailProps>(Thumbnail, {
    action: "imageSource",
    label: "altText"
  });

  return (
    <div className={styles["ProductOverview"]}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={8}>
          <ImageGallery images={images} layout="short" />
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <ProductOverviewPane
            // eslint-disable-next-line security/detect-object-injection
            brandLogo={iconMap[brandName]}
            name={name}
            nobb={nobb}
            thumbnailComponent={(props: ThumbnailProps) => (
              <GTMThumbnail gtm={{ id: "thumbnail1" }} {...props} />
            )}
            nobbLabel={getMicroCopy(microCopy.PDP_NOBB_LABEL)}
            attributes={attributes || undefined}
          >
            {children}
          </ProductOverviewPane>
          {isRecapchaShown && (
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
