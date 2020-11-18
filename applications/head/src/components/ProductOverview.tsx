import React from "react";
import Grid from "@bmi/grid";
import ProductOverviewPane, {
  Props as ProductOverviewProps
} from "@bmi/product-overview-pane";
import ImageGallery, { Image } from "@bmi/image-gallery";
import styles from "./styles/ProductOverview.module.scss";
import { iconMap } from "./Icon";

export type Data = {
  name: string;
  brandName: string;
  nobb: string;
  images: Image[];
  attributes: ProductOverviewProps["attributes"] | null;
};

const ProductOverview = ({
  data: { name, brandName, nobb, images, attributes },
  children
}: {
  data: Data;
  children?: React.ReactNode;
}) => {
  return (
    <div className={styles["ProductOverview"]}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={8}>
          <ImageGallery images={images} />
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <ProductOverviewPane
            brandLogo={iconMap[brandName]}
            name={name}
            nobb={nobb}
            attributes={attributes || undefined}
          >
            {children}
          </ProductOverviewPane>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductOverview;
