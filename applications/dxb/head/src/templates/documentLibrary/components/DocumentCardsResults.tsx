import { Button, Grid, OverviewCard, OverviewCardProps } from "@bmi/components";
import { ContentfulDocument } from "@bmi/elasticsearch-types";
import React from "react";
import { iconMap } from "../../../components/Icon";
import { renderImage } from "../../../components/Image";
import { useSiteContext } from "../../../components/Site";
import { microCopy } from "../../../constants/microCopies";
import withGTM from "../../../utils/google-tag-manager";

type Props = {
  documents: ContentfulDocument[];
};

const DocumentCardsResults = ({ documents }: Props) => {
  const { getMicroCopy } = useSiteContext();

  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  return (
    <Grid container spacing={3}>
      {documents.map((document, index) => {
        return (
          <Grid
            item
            key={`${document.title}-${index}`}
            xs={12}
            sm={12}
            lg={6}
            xl={4}
          >
            <GTMOverviewCard
              title={document.title}
              media={renderImage(document.featuredMedia)}
              // eslint-disable-next-line security/detect-object-injection
              brandImageSource={iconMap[document.BRAND?.name]}
              action={{
                model: "download",
                href: `https:${document.asset.file.url}`,
                ...(document.noIndex && { rel: "noindex" })
              }}
              gtm={{
                id: "cta-click1",
                label: getMicroCopy(microCopy.DOCUMENT_LIBRARY_CARD_DOWNLOAD),
                action: document.asset.file.url
              }}
              footer={
                <Button component="span">
                  {getMicroCopy(microCopy.DOCUMENT_LIBRARY_CARD_DOWNLOAD)}
                </Button>
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DocumentCardsResults;
