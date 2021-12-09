import React from "react";
import Button from "@bmi/button";
import OverviewCard, { OverviewCardProps } from "@bmi/overview-card";
import Grid from "@bmi/grid";
import withGTM from "../utils/google-tag-manager";
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
        ({ title, description, featuredMedia, asset, brand }, index) => {
          return (
            <Grid item key={`${title}-${index}`} xs={12} sm={12} lg={6} xl={4}>
              <GTMOverviewCard
                title={title}
                media={renderImage(featuredMedia) || undefined}
                // eslint-disable-next-line security/detect-object-injection
                brandImageSource={iconMap[brand]}
                action={{
                  model: "download",
                  href: `https:${asset.file.url}`
                }}
                gtm={{
                  id: "cta-click1",
                  label: getMicroCopy("documentLibrary.card.download"),
                  action: asset.file.url
                }}
                footer={
                  <Button component="span">
                    {getMicroCopy("documentLibrary.card.download")}
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
