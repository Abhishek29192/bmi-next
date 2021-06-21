import React from "react";
import Hero from "@bmi/hero";
import Button from "@bmi/button";
import { TrainingProcessCard } from "../TrainingProcess";
import { TrainingQuery } from "../../../graphql/generated/operations";

type TrainingCoverProps = {
  trainingContentCollection: TrainingQuery["trainingContentCollection"];
  lmsUrl?: String;
};

export const TrainingCover = ({
  trainingContentCollection,
  lmsUrl
}: TrainingCoverProps) => {
  // there will only ever be 1 training collection item

  if (!trainingContentCollection?.items?.length) {
    return null;
  }

  const { pageHeading, description, lmsCtaLabel, image } =
    trainingContentCollection.items[0];

  const media = <img src={image.url} />;

  return (
    <>
      <Hero
        media={media}
        title={pageHeading}
        level={1}
        cta={
          <Button
            label={lmsCtaLabel}
            action={{
              model: "htmlLink",
              href: lmsUrl,
              target: "_blank",
              rel: "noopener noreferrer"
            }}
          >
            {lmsCtaLabel}
          </Button>
        }
      >
        {description}
      </Hero>
      <TrainingProcessCard data={trainingContentCollection} />
    </>
  );
};
