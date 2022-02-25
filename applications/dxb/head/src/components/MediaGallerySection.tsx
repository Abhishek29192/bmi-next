import React from "react";
import { graphql } from "gatsby";
import {
  getDefaultPreviewImage,
  Grid,
  MediaData,
  MediaGallery,
  Section,
  Thumbnail,
  ThumbnailProps,
  Typography
} from "@bmi/components";
import withGTM from "../utils/google-tag-manager";
import { GallerySectionMedias } from "../utils/media";
import { renderImage } from "./Image";
import { renderVideo } from "./Video";
import styles from "./styles/MediaGallerySection.module.scss";
import RichText, { RichTextData } from "./RichText";

export type Data = {
  __typename: "ContentfulMediaGallerySection";
  title: string | null;
  longDescription: null | RichTextData;
  medias: GallerySectionMedias[];
};

export const transformMediaSrc = (
  media: GallerySectionMedias[] = []
): MediaData[] => {
  return media.map((item) => {
    switch (item.__typename) {
      case "ContentfulImage":
        return {
          media: renderImage(item),
          thumbnail: item.image.thumbnail.src || null,
          caption: item.caption?.caption || undefined,
          altText: item.altText || undefined,
          isVideo: false
        };
      case "ContentfulVideo":
        return {
          media: renderVideo(item),
          thumbnail:
            item.previewMedia?.image?.thumbnail?.src ||
            getDefaultPreviewImage(item.youtubeId),
          caption: item.subtitle || undefined,
          altText: item.previewMedia?.altText || undefined,
          isVideo: true
        };
    }
  });
};

const IntegratedMediaGallerySection = ({ data }: { data: Data }) => {
  const { title, longDescription, medias } = data;

  const GTMThumbnail = withGTM<ThumbnailProps>(Thumbnail, {
    label: "altText",
    action: "imageSource"
  });

  return (
    <Section
      backgroundColor="alabaster"
      className={styles["MediaGallerySection"]}
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
            thumbnailComponent={(props: ThumbnailProps) => (
              <GTMThumbnail gtm={{ id: "media-gallery1" }} {...props} />
            )}
          />
        </Grid>
      </Grid>
    </Section>
  );
};

export default IntegratedMediaGallerySection;

export const query = graphql`
  fragment MediaGallerySectionFragment on ContentfulMediaGallerySection {
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
