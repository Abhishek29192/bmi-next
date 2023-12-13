import Grid from "@bmi-digital/components/grid";
import React from "react";
import Protrusions from "./_Protrusions";
import { Root, classes } from "./_RoofDimensions.styles";
import InputTextField from "./subcomponents/_InputTextField";
import { DimensionsValues, RoofV2 as Roof } from "./types/roof";

export type RoofDimensionsProps = {
  dimensions: DimensionsValues;
  roof: Roof;
};

const RoofDimensions = ({ dimensions, roof }: RoofDimensionsProps) => {
  const Illustration = roof.dimensionsIllustration;
  return (
    <Root>
      <div className={classes.form}>
        <Illustration className={classes.illustration} />
        <Grid container spacing={3} justifyContent="center">
          {roof.fields.map(({ name, type }) => (
            <Grid key={name} xs={12} lg={3}>
              <InputTextField
                // eslint-disable-next-line security/detect-object-injection
                defaultValue={dimensions[name]}
                {...{ name, type }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <Protrusions defaultValue={dimensions.protrusions} />
    </Root>
  );
};

export default RoofDimensions;
