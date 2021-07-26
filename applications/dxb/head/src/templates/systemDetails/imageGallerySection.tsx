import React from "react";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import ImageGallery from "@bmi/image-gallery";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import AnchorLink from "@bmi/anchor-link";
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
              .map((item, index) => (
                <Accordion.Item key={index}>
                  <Accordion.Summary>
                    <Typography variant="default">
                      {`${item.layerNumber}. ${item.type}: ${item.name}`}
                    </Typography>
                  </Accordion.Summary>

                  <Accordion.Details>
                    <Grid container spacing={3}>
                      {item.relatedProducts?.map((product) => (
                        <Grid item xs={12} md={12} lg={12} key={product.code}>
                          <AnchorLink action={{ model: "htmlLink", href: "/" }}>
                            {product.name}
                          </AnchorLink>
                        </Grid>
                      ))}

                      <Grid item xs={12} md={12} lg={12}>
                        <Typography variant="default">
                          {item.shortDescription}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12}>
                        <Typography variant="h5">
                          Additional optional products
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12}>
                        <AnchorLink action={{ model: "htmlLink", href: "/" }}>
                          Product name 1
                        </AnchorLink>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12}>
                        <AnchorLink action={{ model: "htmlLink", href: "/" }}>
                          Product name 2
                        </AnchorLink>
                      </Grid>

                      <Grid item xs={12} md={12} lg={12}>
                        <AnchorLink action={{ model: "htmlLink", href: "/" }}>
                          Product name 3
                        </AnchorLink>
                      </Grid>
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
