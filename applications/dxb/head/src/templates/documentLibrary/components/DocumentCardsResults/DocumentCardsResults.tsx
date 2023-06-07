import { Grid, OverviewCard, OverviewCardProps } from "@bmi-digital/components";
import { ContentfulDocument } from "@bmi/elasticsearch-types";
import React from "react";
import BrandLogo from "../../../../components/BrandLogo";
import {
  CopyToClipboard,
  DownloadDocumentButton
} from "../../../../components/DocumentSimpleTableResultCommon";
import Image from "../../../../components/Image";
import { useSiteContext } from "../../../../components/Site";
import { microCopy } from "../../../../constants/microCopies";
import withGTM from "../../../../utils/google-tag-manager";
import { Actions, Divider } from "./styles";

type Props = {
  documents: ContentfulDocument[];
};

const DocumentCardsResults = ({ documents }: Props) => {
  const { getMicroCopy } = useSiteContext();

  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  return (
    <Grid container spacing={3} data-testid="document-cards-results-grid">
      {documents.map((document, index) => {
        return (
          <Grid
            key={`${document.title}-${index}`}
            xs={12}
            sm={12}
            lg={6}
            xl={4}
          >
            <GTMOverviewCard
              clickableArea="body"
              action={{
                model: "download",
                href: `https:${document.asset.file.url}`,
                ...(document.noIndex && { rel: "noindex" })
              }}
              hasActions
              title={document.title}
              media={
                document.featuredMedia && <Image {...document.featuredMedia} />
              }
              brandImageSource={
                document.BRAND && <BrandLogo brandName={document.BRAND?.name} />
              }
              gtm={{
                id: "cta-click1",
                label: getMicroCopy(microCopy.DOCUMENT_LIBRARY_CARD_DOWNLOAD),
                action: document.asset.file.url
              }}
              footer={
                <Actions>
                  <CopyToClipboard
                    id={document.id}
                    url={document.asset.file.url}
                    size="large"
                    title={document.title}
                  />
                  <Divider />
                  <DownloadDocumentButton document={document} size="large" />
                </Actions>
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DocumentCardsResults;
