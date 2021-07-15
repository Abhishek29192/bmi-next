import React, { useContext } from "react";
import Button, { ButtonProps } from "@bmi/button";
import OverviewCard from "@bmi/overview-card";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Grid from "@bmi/grid";
import withGTM from "../utils/google-tag-manager";
import { Data as DocumentData } from "./Document";
import RichText from "./RichText";
import { SiteContext } from "./Site";
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
  const { getMicroCopy } = useContext(SiteContext);
  const paginatedDocuments = documents.slice(
    (page - 1) * documentsPerPage,
    page * documentsPerPage
  );

  const GTMButton = withGTM<ButtonProps>(Button);

  return (
    <Grid container spacing={3}>
      {paginatedDocuments.map(
        ({ title, description, featuredMedia, asset, brand }, index) => {
          return (
            <Grid item key={`${title}-${index}`} xs={12} sm={12} lg={6} xl={4}>
              <OverviewCard
                title={title}
                hasTitleUnderline
                media={renderImage(featuredMedia) || undefined}
                brandImageSource={iconMap[brand]}
                footer={
                  <GTMButton
                    action={{
                      model: "download",
                      href: `https:${asset.file.url}`
                    }}
                    variant="outlined"
                    startIcon={<ArrowForwardIcon />}
                    gtm={{
                      id: "cta-click1",
                      label: getMicroCopy("documentLibrary.card.download"),
                      action: asset.file.url
                    }}
                  >
                    {getMicroCopy("documentLibrary.card.download")}
                  </GTMButton>
                }
              >
                {description && <RichText document={description} />}
              </OverviewCard>
            </Grid>
          );
        }
      )}
    </Grid>
  );
};

export default DocumentCardsResults;
