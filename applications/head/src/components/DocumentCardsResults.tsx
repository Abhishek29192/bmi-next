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
};

const DocumentCardsResults = ({ documents }: Props) => {
  const { getMicroCopy } = useContext(SiteContext);

  return (
    <Grid container spacing={3}>
      {documents.map(({ title, description, image, asset, brand }, index) => {
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
              {description && <RichText document={description.json} />}
            </OverviewCard>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DocumentCardsResults;
