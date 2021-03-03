import React from "react";
import Grid from "@bmi/grid";
import TextField from "@bmi/text-field";
import styles from "./_RoofDimensions.module.scss";

const isNumber = (value: string) => /^([0-9])+(\.[0-9]+)?$/.test(value);

/*
  TODO: messages to be converted to using microcopy-like replacement
  https://bmigroup.atlassian.net/browse/WEBT-202
 */

const numberValidator = (value, errorMessage) => {
  if (typeof value !== "string") {
    throw new Error("This validator only take string values");
  }

  if (value === "") {
    return errorMessage || "This field is required";
  }

  if (!isNumber(value)) {
    return errorMessage || "This field must have a positive number";
  }
};

type RangeValidatorCreator = (
  min: number,
  max: number,
  errorMessage?: string
) => (value: string) => string | undefined;

const rangeValidator: RangeValidatorCreator = (min, max, errorMessage) => (
  value
) => {
  const error = numberValidator(value, errorMessage);
  if (error) return error;

  const number = parseFloat(value);

  if (number < min || number > max) {
    return errorMessage || `This number must be between ${min} and ${max}`;
  }
};

type Type = "LENGTH" | "PITCH";

type TypeProps = {
  unit: string;
  validator: (value: string) => string | undefined;
  helperText?: string;
};

const types: {
  [key in Type]: TypeProps;
} = {
  LENGTH: {
    unit: "m",
    validator: rangeValidator(2, 200, "Min 2m and Max 200m"),
    helperText: "Min 2m and Max 200m"
  },
  PITCH: {
    unit: "deg",
    validator: rangeValidator(6, 85, "Min 6 and Max 85 deg"),
    helperText: "Min 6 and Max 85 deg"
  }
};

type RoofDimensionsProps = {
  dimensions: Record<string, string>;
  roof?: any;
};

const RoofDimensions = ({
  dimensions,
  roof: { dimensionsIllustration: Illustration, dimensions: items }
}: RoofDimensionsProps) => {
  return (
    <div className={styles["RoofDimensions"]}>
      <div className={styles["form"]}>
        <Illustration className={styles["illustration"]} />
        <Grid container spacing={3}>
          {items.map(({ name, type }) => (
            <Grid key={name} item xs={12} md={3}>
              <TextField
                name={name}
                type="number"
                variant="outlined"
                label={name}
                helperText={types[type].helperText}
                defaultValue={dimensions[name]}
                getValidationError={types[type].validator}
                rightAdornment={types[type].unit}
                fullWidth
                InputProps={{
                  className: styles["input"]
                }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default RoofDimensions;
