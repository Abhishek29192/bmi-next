import React from "react";
import { graphql } from "gatsby";
import ImageGallery, { Image } from "@bmi/image-gallery";
import Typography from "@bmi/typography";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import styles from "./styles/ImageGallerySection.module.scss";

type GallerySectionImage = {
  title: string;
  mainSource: {
    src: string;
  };
  thumbnail: {
    src: string;
  };
};

export type Data = {
  __typename: "ContentfulImageGallerySection";
  title: string;
  description: null | { description: string };
  images: GallerySectionImage[];
};

export const transformImagesSrc = (images: GallerySectionImage[]): Image[] => {
  return images.map((item) => ({
    mainSource: item.mainSource.src,
    thumbnail: item.thumbnail.src,
    altText: item.title
  }));
};

const IntegratedImageGallerySection = ({ data }: { data: Data }) => {
  const { title, description, images } = data;

  return (
    <Section
      backgroundColor="alabaster"
      className={styles["ImageGallerySection"]}
    >
      <Grid container>
        <Grid item xs={12} lg={8}>
          <Typography variant="h1" hasUnderline>
            {title}
          </Typography>
          <Typography className={styles["description"]}>
            {description.description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ImageGallery
            images={transformImagesSrc(images)}
            imageSize="cover"
          ></ImageGallery>
        </Grid>
      </Grid>
    </Section>
  );
};

export default IntegratedImageGallerySection;

export const query = graphql`
  fragment ImageGallerySectionFragment on ContentfulImageGallerySection {
    title
    description {
      description
    }
    images {
      title
      mainSource: resize(width: 1440, quality: 75) {
        src
      }
      thumbnail: resize(width: 80, height: 60) {
        src
      }
    }
  }
`;
