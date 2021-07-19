import React from "react";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import ImageGallery from "@bmi/image-gallery";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import { mapGalleryImages } from "../../utils/product-details-transforms";
import { Image } from "../../components/types/ProductBaseTypes";
import { GalleryImageType, SystemLayer } from "./types";
import styles from "./styles/imageGallerySection.module.scss";

type Props = {
  images: Image[];
  accordionItems: SystemLayer[];
};

const ImageGallerySection = ({ images, accordionItems }: Props) => {
  const transformImages = (images: Array<GalleryImageType>) => {
    return images.map(({ mainSource, thumbnail, altText }) => ({
      media: <img src={mainSource} alt={altText} />,
      thumbnail
    }));
  };

  return (
    <Section backgroundColor="pearl" className={styles["imageGallery-section"]}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={8}>
          <ImageGallery
            className={styles["gallery"]}
            images={transformImages(mapGalleryImages(images))}
            layout="short"
          />
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Accordion>
            {accordionItems
              .sort((a, b) => a.layerNumber - b.layerNumber)
              .map((item) => (
                <Accordion.Item key={item.layerNumber}>
                  <Accordion.Summary>
                    <Typography variant="default">
                      {`${item.layerNumber}. ${item.type}: ${item.name}`}
                    </Typography>
                  </Accordion.Summary>

                  <Accordion.Details>
                    <Grid container spacing={3}>
                      <Typography>Mandatory product name H6 link</Typography>
                      <Typography>{item.shortDescription}</Typography>
                      <Typography>Additional optional products</Typography>
                      <Typography>Product name 1</Typography>
                      <Typography>Product name 2</Typography>
                      <Typography>Product name 3</Typography>
                    </Grid>
                  </Accordion.Details>
                </Accordion.Item>
              ))}
          </Accordion>
        </Grid>
      </Grid>
    </Section>
  );
};

export default ImageGallerySection;
