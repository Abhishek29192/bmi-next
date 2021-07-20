import React from "react";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import ImageGallery from "@bmi/image-gallery";
import { mapGalleryImages } from "../../utils/product-details-transforms";
import { Image } from "../../components/types/ProductBaseTypes";
import { GalleryImageType } from "./types";
import styles from "./styles/imageGallerySection.module.scss";

type Props = {
  images: Image[];
};

const ImageGallerySection = ({ images }: Props) => {
  const transformImages = (images: Array<GalleryImageType>) => {
    return images.map(({ mainSource, thumbnail, altText }) => ({
      media: <img src={mainSource} alt={altText} />,
      thumbnail
    }));
  };

  return (
    <Section backgroundColor="pearl">
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={8}>
          <ImageGallery
            className={styles["gallery"]}
            images={transformImages(mapGalleryImages(images))}
            layout="short"
          />
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <div style={{ height: "1500px", backgroundColor: "green" }}>
            Layers Accordion will be here
          </div>
        </Grid>
      </Grid>
    </Section>
  );
};

export default ImageGallerySection;
