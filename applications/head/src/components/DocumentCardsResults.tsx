import React, { useContext } from "react";
import Button from "@bmi/button";
import { Data as DocumentData } from "./Document";
import OverviewCard from "@bmi/overview-card";
import RichText from "./RichText";
import { SiteContext } from "./Site";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Grid from "@bmi/grid";
import { iconMap } from "./Icon";

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

  return (
    <Grid container spacing={3}>
      {paginatedDocuments.map(
        ({ title, description, image, asset, brand }, index) => {
          return (
            <Grid item key={`${title}-${index}`} xs={12} sm={12} lg={6} xl={4}>
              <OverviewCard
                title={title}
                hasTitleUnderline
                imageSource={image ? image.resize.src : undefined}
                brandImageSource={iconMap[brand]}
                footer={
                  <Button
                    action={{
                      model: "download",
                      href: `https:${asset.file.url}`
                    }}
                    variant="outlined"
                    startIcon={<ArrowForwardIcon />}
                  >
                    {getMicroCopy("documentLibrary.card.download")}
                  </Button>
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
