import React from "react";
import { Button } from "@bmi/components";
import { OverviewCard, OverviewCardProps } from "@bmi/components";
import { Grid } from "@bmi/components";
import withGTM from "../utils/google-tag-manager";
import { microCopy } from "../constants/microCopies";
import { Data as DocumentData } from "./Document";
import RichText from "./RichText";
import { useSiteContext } from "./Site";
import { iconMap } from "./Icon";
import { renderImage } from "./Image";

type Props = {
  documents: DocumentData[];
  page: number;
  documentsPerPage: number;
};

export const getCount = (documents: Props["documents"]) => {
  return documents.length;
};

const DocumentCardsResults = ({ documents, page, documentsPerPage }: Props) => {
  const { getMicroCopy } = useSiteContext();
  const paginatedDocuments = documents.slice(
    (page - 1) * documentsPerPage,
    page * documentsPerPage
  );

  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  return (
    <Grid container spacing={3}>
      {paginatedDocuments.map(
        (
          { title, description, featuredMedia, asset, brand, noIndex },
          index
        ) => {
          return (
            <Grid item key={`${title}-${index}`} xs={12} sm={12} lg={6} xl={4}>
              <GTMOverviewCard
                title={title}
                media={renderImage(featuredMedia) || undefined}
                // eslint-disable-next-line security/detect-object-injection
                brandImageSource={iconMap[brand]}
                action={{
                  model: "download",
                  href: `https:${asset.file.url}`,
                  ...(noIndex && { rel: "noindex" })
                }}
                gtm={{
                  id: "cta-click1",
                  label: getMicroCopy(microCopy.DOCUMENT_LIBRARY_CARD_DOWNLOAD),
                  action: asset.file.url
                }}
                footer={
                  <Button component="span">
                    {getMicroCopy(microCopy.DOCUMENT_LIBRARY_CARD_DOWNLOAD)}
                  </Button>
                }
              >
                {description && <RichText document={description} />}
              </GTMOverviewCard>
            </Grid>
          );
        }
      )}
    </Grid>
  );
};

export default DocumentCardsResults;
