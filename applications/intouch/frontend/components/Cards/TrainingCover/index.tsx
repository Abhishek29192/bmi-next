import React from "react";
import Hero from "@bmi/hero";
import Button from "@bmi/button";
import Grid from "@bmi/grid";
import { TrainingProcessCard } from "../TrainingProcess";
import GridStyles from "../../../styles/Grid.module.scss";
import { TrainingQuery } from "../../../graphql/generated/operations";

type TrainingCoverProps = {
  trainingContentCollection: TrainingQuery["trainingContentCollection"];
};

export const TrainingCover = ({
  trainingContentCollection
}: TrainingCoverProps) => {
  // there will only ever be 1 training collection item
  const { pageHeading, description, lmsCtaLabel, image } =
    trainingContentCollection.items[0];

  const media = <img src={image.url} />;

  return (
    <Grid
      container
      spacing={3}
      className={GridStyles.outerGrid}
      alignItems="stretch"
    >
      <Grid item xs={12}>
        <Hero
          media={media}
          title={pageHeading}
          level={1}
          cta={
            <Button
              label={lmsCtaLabel}
              action={{
                model: "htmlLink",
                href: "", // TODO: what url is this?
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
      </Grid>
    </Grid>
  );
};
