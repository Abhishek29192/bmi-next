import React from "react";
import { microCopy } from "@bmi/microcopies";
import { Typography } from "@bmi-digital/components";
import { useSiteContext } from "../../../components/Site";
import { Data } from "../../../components/TitleWithContent";
import RichText from "../../../components/RichText";
import { Title } from "./training-catalogue-styles";

type Props = {
  searchTips: Data;
};

const TrainingNoResults = ({ searchTips }: Props) => {
  const { getMicroCopy } = useSiteContext();

  const searchTitle = getMicroCopy(microCopy.TRAINING_LISTING_NO_SEARCH_TITLE);
  const searchDescription = getMicroCopy(
    microCopy.TRAINING_LISTING_NO_SEARCH_DESCRIPTION
  );

  return (
    <>
      <div>
        <Title variant="h3" hasUnderline data-testid="nosearch-catalogue-title">
          {searchTitle}
        </Title>

        <Typography data-testid="nosearch-catalogue-description">
          {searchDescription}
        </Typography>
      </div>
      <div style={{ marginTop: "20px" }}>
        {searchTips?.title && (
          <Typography variant="h4" data-testid="nosearch-training-title">
            {searchTips.title}
          </Typography>
        )}
        {searchTips?.content && <RichText document={searchTips.content} />}
      </div>
    </>
  );
};

export default TrainingNoResults;
