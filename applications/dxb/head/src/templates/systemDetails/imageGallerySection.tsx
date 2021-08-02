import React from "react";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import ImageGallery from "@bmi/image-gallery";
import { mapGalleryImages } from "../../utils/product-details-transforms";
import { Image } from "../../components/types/ProductBaseTypes";
import { GalleryImageType } from "./types";

type Props = {
  images: Image[];
};

const ImageGallerySection = ({ images = [] }: Props) => {
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
            images={transformImages(mapGalleryImages(images ? images : []))}
            layout="short"
          />
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          Layers Accordion will be here
        </Grid>
      </Grid>
    </Section>
  );
};

export default ImageGallerySection;
