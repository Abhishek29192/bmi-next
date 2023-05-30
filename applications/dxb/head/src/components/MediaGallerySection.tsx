import {
  Grid,
  MediaGallery,
  replaceSpaces,
  Section,
  Thumbnail,
  ThumbnailProps,
  Typography
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import { GallerySectionMedias, transformMediaSrc } from "../utils/media";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import styles from "./styles/MediaGallerySection.module.scss";

export type Data = {
  __typename: "ContentfulMediaGallerySection";
  title: string | null;
  longDescription: null | RichTextData;
  medias: GallerySectionMedias[];
};

const IntegratedMediaGallerySection = ({ data }: { data: Data }) => {
  const { title, longDescription, medias } = data;
  const { getMicroCopy } = useSiteContext();

  const GTMThumbnail = withGTM<ThumbnailProps>(Thumbnail, {
    label: "altText",
    action: "imageSource"
  });

  return (
    <Section
      backgroundColor="alabaster"
      className={styles["MediaGallerySection"]}
      data-testid={`media-gallery-section-${replaceSpaces(data.title)}`}
    >
      <Grid container>
        <Grid xs={12} lg={8} className={styles["gridItem"]}>
          {title && (
            <Typography variant="h2" hasUnderline>
              {title}
            </Typography>
          )}
          {longDescription && (
            <div className={styles["description"]}>
              <RichText document={longDescription} hasNoBottomMargin />
            </div>
          )}
        </Grid>
        <Grid xs={12} py={0} className={styles["gridItem"]}>
          <MediaGallery
            media={transformMediaSrc(medias)}
            mediaSize="cover"
            thumbnailComponent={(props: ThumbnailProps) => (
              <GTMThumbnail gtm={{ id: "media-gallery1" }} {...props} />
            )}
            videoButtonLabel={getMicroCopy(microCopy.MEDIA_VIDEO)}
            visualiserButtonLabel={getMicroCopy(microCopy.MEDIA_3D)}
            visualiserText={getMicroCopy(microCopy.MEDIA_VISUALIZER_TEXT)}
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
