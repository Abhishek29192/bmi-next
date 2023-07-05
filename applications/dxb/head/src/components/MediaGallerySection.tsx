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
import {
  StyledDescription,
  StyledGridItem
} from "./styles/MediaGallerySection.styles";

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
      data-testid={`media-gallery-section-${replaceSpaces(data.title)}`}
    >
      <Grid container>
        <StyledGridItem xs={12} lg={8}>
          {title && (
            <Typography variant="h2" hasUnderline>
              {title}
            </Typography>
          )}
          {longDescription && (
            <StyledDescription>
              <RichText document={longDescription} hasNoBottomMargin />
            </StyledDescription>
          )}
        </StyledGridItem>
        <StyledGridItem xs={12} py={0}>
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
        </StyledGridItem>
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
