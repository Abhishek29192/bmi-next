import React from "react";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import ImageGallery from "@bmi/image-gallery";
import { result, groupBy, find } from "lodash";
import { SystemProductImageType, GalleryImageType } from "./types";

type Props = {
  images: SystemProductImageType[];
};

const ImageGallerySection = ({ images }: Props) => {
  const mapGalleryImages = (
    images: Array<SystemProductImageType>
  ): Array<GalleryImageType> => {
    const imagesByFormat = Object.values(groupBy(images, "containerId"));
    const masterImageSet = imagesByFormat.filter(
      // NOTE: Only use one MASTER_IMAGE between the main product and the variant.
      (_images, index, self) => {
        return (
          self.findIndex((images) =>
            images.some(({ assetType }) => assetType === "MASTER_IMAGE")
          ) === index
        );
      }
    );
    const imageSets = [
      ...masterImageSet,
      ...imagesByFormat.filter((images) =>
        images.some((image) => image.assetType === "GALLERY")
      )
    ];

    return imageSets.map((images) => ({
      mainSource: result<string>(
        find(images, {
          format: "Product-Hero-Small-Desktop-Tablet"
        }),
        "url"
      ),
      thumbnail: result<string>(
        find(images, {
          format: "Product-Color-Selector-Mobile"
        }),
        "url"
      ),
      altText: images[0].altText || images[0].name
    }));
  };

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
