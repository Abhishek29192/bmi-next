import React from "react";
import { graphql } from "gatsby";
import Thumbnail, { Props as ThumbnailProps } from "@bmi/thumbnail";
import Typography from "@bmi/typography";
import Section from "@bmi/section";
import Grid from "@bmi/grid";
import MediaGallery, { Media as MediaData } from "@bmi/media-gallery";
import withGTM from "../utils/google-tag-manager";
import { Data as ImageData, renderImage } from "./Image";
import styles from "./styles/ImageGallerySection.module.scss";
import { Data as ContenfulVideoData, renderVideo } from "./Video";
import RichText, { RichTextData } from "./RichText";

type GallerySectionImage = Omit<ImageData, "image"> & {
  image: ImageData["image"] & {
    thumbnail: {
      src: string;
    };
  };
};

type GallerySectionVideo = Omit<ContenfulVideoData, "previewMedia"> & {
  previewMedia: ContenfulVideoData["previewMedia"] & {
    image: ContenfulVideoData["previewMedia"]["image"] & {
      thumbnail: {
        src: string;
      };
    };
  };
};

type GallerySectionMedias = GallerySectionImage | GallerySectionVideo; //TODO add PimSECTIONVIDEO
export type Data = {
  __typename: "ContentfulImageGallerySection";
  title: string | null;
  longDescription: null | RichTextData;
  medias: GallerySectionMedias[];
};

export const transformMediaSrc = (
  media: GallerySectionMedias[] = []
): MediaData[] => {
  // this conditions makes like that because ts doesn't recognized different types of union GallerySectionMedias
  return media.map((item) => {
    if (item.__typename === "ContentfulImage") {
      return {
        media: renderImage(item),
        thumbnail: item.image.thumbnail.src || null,
        caption: item.caption?.caption || undefined,
        isVideo: false
      };
    }
    if (item.__typename === "ContentfulVideo") {
      return {
        media: renderVideo(item),
        thumbnail: item.previewMedia.image.thumbnail.src || null,
        caption: item.subtitle || undefined,
        isVideo: true
      };
    }
  });
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
          <MediaGallery
            media={transformMediaSrc(medias)}
            mediaSize="cover"
            thumbnailComponent={(props: ThumbnailProps) => {
              return <GTMThumbnail gtm={{ id: "image-gallery1" }} {...props} />;
            }}
          />
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
      ...VideoGallerySlideFragment
    }
  }
`;
