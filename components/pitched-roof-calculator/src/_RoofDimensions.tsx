import React from "react";
import Grid from "@bmi/grid";
import InputTextField from "./subcomponents/_InputTextField";
import Protrusions from "./_Protrusions";
import styles from "./_RoofDimensions.module.scss";
import { DimensionsValues, Roof } from "./types/roof";

type RoofDimensionsProps = {
  dimensions: DimensionsValues;
  roof?: Roof;
};

const RoofDimensions = ({
  dimensions,
  roof: { dimensionsIllustration: Illustration, fields: items }
}: RoofDimensionsProps) => {
  return (
    <div className={styles["RoofDimensions"]}>
      <div className={styles["form"]}>
        <Illustration className={styles["illustration"]} />
        <Grid container spacing={3}>
          {items.map(({ name, type }) => (
            <Grid key={name} item xs={12} lg={3}>
              <InputTextField
                defaultValue={dimensions[name]}
                {...{ name, type }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <Protrusions defaultValue={dimensions.protrusions} />
    </div>
  );
};

export default RoofDimensions;