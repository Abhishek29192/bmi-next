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
  nnob: string;
  images: Image[];
  attributes: ProductOverviewProps["attributes"] | null;
};

const ProductOverview = ({
  data: { name, brandName, nnob, images, attributes }
}: {
  data: Data;
}) => {
  return (
    <div className={styles["ProductOverview"]}>
      <Grid container spacing={3}>
        <Grid item xs={1} sm={8}>
          <ImageGallery images={images} />
        </Grid>
        <Grid item xs={1} sm={4}>
          <ProductOverviewPane
            brandLogo={iconMap[brandName]}
            name={name}
            nnob={nnob}
            attributes={attributes || undefined}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductOverview;
