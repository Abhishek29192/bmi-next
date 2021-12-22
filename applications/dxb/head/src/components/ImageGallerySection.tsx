import React from "react";
import { graphql } from "gatsby";
import ImageGallery, { Image } from "@bmi/image-gallery";
import Thumbnail, { Props as ThumbnailProps } from "@bmi/thumbnail";
import Typography from "@bmi/typography";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import withGTM from "../utils/google-tag-manager";
import { renderImage, Data as ImageData } from "./Image";
import styles from "./styles/ImageGallerySection.module.scss";
import RichText, { RichTextData } from "./RichText";

type GallerySectionImage = Omit<ImageData, "image"> & {
  image: ImageData["image"] & {
    thumbnail: {
      src: string;
    };
  };
};

export type Data = {
  __typename: "ContentfulImageGallerySection";
  title: string | null;
  longDescription: null | RichTextData;
  medias: GallerySectionImage[];
};

export const transformImagesSrc = (images?: GallerySectionImage[]): Image[] => {
  return (images || []).map((item) => ({
    media: renderImage(item),
    thumbnail: item.image.thumbnail.src,
    caption: item.caption?.caption || undefined,
    altText: item.altText || undefined
  }));
};

const IntegratedImageGallerySection = ({ data }: { data: Data }) => {
  const { title, longDescription, medias } = data;

  const GTMThumbnail = withGTM<ThumbnailProps>(Thumbnail, {
    label: "altText",
    action: "imageSource"
  });

  return (
    <Section
      backgroundColor="alabaster"
      className={styles["ImageGallerySection"]}
    >
      <Grid container>
        <Grid item xs={12} lg={8}>
          {title && (
            <Typography variant="h2" hasUnderline>
              {title}
            </Typography>
          )}
          {longDescription && (
            <div className={styles["description"]}>
              <RichText document={longDescription} />
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          <ImageGallery
            images={transformImagesSrc(medias)}
            imageSize="cover"
            thumbnailComponent={(props: ThumbnailProps) => (
              <GTMThumbnail gtm={{ id: "image-gallery1" }} {...props} />
            )}
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
    longDescription {
      ...RichTextFragment
    }
    medias {
      ...ImageGallerySlideFragment
      image {
        thumbnail: resize(width: 80, height: 60) {
          src
        }
      }
    }
  }
`;
