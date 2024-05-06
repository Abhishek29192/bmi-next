import DocumentCard from "@bmi-digital/components/document-card";
import Grid from "@bmi-digital/components/grid";
import { ContentfulDocument } from "@bmi/elasticsearch-types";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import BrandLogo from "../../../../components/BrandLogo";
import { useSiteContext } from "../../../../components/Site";
import createImageProps from "../../../../components/image/createImageProps";

type Props = {
  documents: ContentfulDocument[];
};

const DocumentCardsResults = ({ documents }: Props) => {
  const { getMicroCopy } = useSiteContext();

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
            <DocumentCard
              id={document.id}
              href={`https:${document.asset.file.url}`}
              noIndex={true}
              title={document.title}
              media={
                document.featuredMedia &&
                createImageProps(document.featuredMedia)
              }
              brandLogo={
                document.BRAND ? (
                  <BrandLogo brandName={document.BRAND.name} />
                ) : undefined
              }
              gtm={{
                id: "cta-click1",
                label: getMicroCopy(microCopy.DOCUMENT_LIBRARY_CARD_DOWNLOAD),
                action: document.asset.file.url
              }}
              copyAccessibilityLabel={getMicroCopy(
                microCopy.DOCUMENT_LIBRARY_COPY_LINK_ACCESSIBILITY_LABEL
              )}
              copyLinkTooltip={getMicroCopy(
                microCopy.DOCUMENT_LIBRARY_COPY_LINK_TOOLTIP_TITLE
              )}
              linkCopiedTooltip={getMicroCopy(
                microCopy.DOCUMENT_LIBRARY_LINK_COPIED_TOOLTIP_TITLE
              )}
              downloadAccessibilityLabel={getMicroCopy(
                microCopy.DOCUMENT_LIBRARY_DOWNLOAD_ACCESSIBILITY_LABEL
              )}
              downloadTooltip={getMicroCopy(
                microCopy.DOCUMENT_LIBRARY_DOWNLOAD_TOOLTIP_TITLE
              )}
              clipboardErrorMessage={getMicroCopy(
                microCopy.COPY_LINK_ERROR_MESSAGE
              )}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DocumentCardsResults;
