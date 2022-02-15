import React from "react";
import { Form } from "@bmi-digital/components";
import { Grid } from "@bmi-digital/components";
import { TextField } from "@bmi-digital/components";
import Field from "./_Field";
import FormSection from "./_FormSection";
import styles from "./FlatRoofCalculator.module.scss";
import { FormValues } from "./types/FormValues";

const isNumber = (value: string) => !Number.isNaN(Number.parseFloat(value));

const numberValidator = (value?: string) => {
  if (typeof value !== "string") {
    throw new Error("This validator only take string values");
  }

  if (value === "") {
    // Ignore since we're checking for required separately
    return false;
  }

  if (!isNumber(value)) {
    return "This field must have a positive number";
  }
};

const getPositiveMinimumValueValidator =
  (fieldName: string, minValue: number, unit: string, zeroMessage?: string) =>
  (value?: string) => {
    if (typeof value !== "string") {
      throw new Error("This validator only take string values");
    }

    if (value === "") {
      // Ignore since we're checking for required separately
      return false;
    }

    if (!isNumber(value)) {
      return "This field must have a positive number";
    }

    const number = parseFloat(value);

    if (number === 0 && zeroMessage) {
      return zeroMessage;
    }

    if (number < minValue) {
      return `Minimum ${fieldName} is ${minValue}${unit}`;
    }
  };

const convertDefault = (value?: number) =>
  typeof value === "undefined" ? "" : "" + value;

type Props = {
  header: string;
  description?: string;
  defaultValues: FormValues;
  help: {
    fieldArea?: React.ReactNode;
    upstand?: React.ReactNode;
    kerb?: React.ReactNode;
    details?: React.ReactNode;
  };
};

const MeasurementsSection = ({
  header,
  description,
  help,
  defaultValues
}: Props) => (
  <FormSection {...{ header, description }}>
    <Field label={"Field area"} helpContent={help.fieldArea}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Form.Row>
            <TextField
              name="fieldArea"
              defaultValue={convertDefault(defaultValues["fieldArea"])}
              isRequired
              variant="outlined"
              label="Total field area"
              getValidationError={numberValidator}
              rightAdornment={
                <span>
                  m<sup>2</sup>
                </span>
              }
              fullWidth
              inputProps={{ className: styles.input }}
            />
          </Form.Row>
        </Grid>
      </Grid>
    </Field>
    <Field label={"Upstand (optional)"} helpContent={help.upstand}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Form.Row>
            <TextField
              name="upstandHeight"
              defaultValue={convertDefault(defaultValues["upstandHeight"])}
              variant="outlined"
              label="Upstand Height"
              helperText="Minimum upstand height is 150mm"
              getValidationError={getPositiveMinimumValueValidator(
                "upstand height",
                150,
                "mm"
              )}
              rightAdornment={<span>mm</span>}
              fullWidth
              inputProps={{ className: styles.input }}
            />
          </Form.Row>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Row>
            <TextField
              name="upstandLength"
              defaultValue={convertDefault(defaultValues["upstandLength"])}
              variant="outlined"
              label="Upstand Length"
              helperText="Minimum upstand length is 1m"
              getValidationError={getPositiveMinimumValueValidator(
                "upstand length",
                1,
                "m"
              )}
              rightAdornment={<span>m</span>}
              fullWidth
              inputProps={{ className: styles.input }}
            />
          </Form.Row>
        </Grid>
      </Grid>
    </Field>
    <Field
      label={"Kerb / verge / drip detail (optional)"}
      helpContent={help.kerb}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Form.Row>
            <TextField
              name="kerbHeight"
              defaultValue={convertDefault(defaultValues["kerbHeight"])}
              variant="outlined"
              label="Kerb Height"
              helperText="Minimum kerb / verge detail size is 100mm"
              getValidationError={getPositiveMinimumValueValidator(
                "kerb / verge detail size",
                100,
                "mm"
              )}
              rightAdornment={<span>mm</span>}
              fullWidth
              inputProps={{ className: styles.input }}
            />
          </Form.Row>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Row>
            <TextField
              name="kerbLength"
              defaultValue={convertDefault(defaultValues["kerbLength"])}
              variant="outlined"
              label="Kerb Length"
              helperText="Minimum kerb / verge / drip length is 1m"
              getValidationError={getPositiveMinimumValueValidator(
                "kerb / verge / drip length",
                1,
                "m"
              )}
              rightAdornment={<span>m</span>}
              fullWidth
              inputProps={{ className: styles.input }}
            />
          </Form.Row>
        </Grid>
      </Grid>
    </Field>
    <Field label={"Additional detailing (optional)"} helpContent={help.details}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Form.Row>
            <TextField
              name="detailHeight1"
              defaultValue={convertDefault(defaultValues["detailHeight1"])}
              variant="outlined"
              label="Detail Height"
              helperText="Minimum detail height is 100mm"
              getValidationError={getPositiveMinimumValueValidator(
                "detail height",
                100,
                "mm",
                "This field should either have a positive number or be left blank"
              )}
              rightAdornment={<span>mm</span>}
              fullWidth
              inputProps={{ className: styles.input }}
            />
          </Form.Row>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Row>
            <TextField
              name="detailLength1"
              defaultValue={convertDefault(defaultValues["detailLength1"])}
              variant="outlined"
              label="Detail Length"
              helperText="Minimum detail length is 1m"
              getValidationError={getPositiveMinimumValueValidator(
                "detail length",
                1,
                "m",
                "This field should either have a positive number or be left blank"
              )}
              rightAdornment={<span>m</span>}
              fullWidth
              inputProps={{ className: styles.input }}
            />
          </Form.Row>
        </Grid>
      </Grid>
    </Field>
    <Field label={"Additional detailing (optional)"} helpContent={help.details}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Form.Row>
            <TextField
              name="detailHeight2"
              defaultValue={convertDefault(defaultValues["detailHeight2"])}
              variant="outlined"
              label="Detail Height"
              helperText="Minimum detail height is 100mm"
              getValidationError={getPositiveMinimumValueValidator(
                "detail height",
                100,
                "mm",
                "This field should either have a positive number or be left blank"
              )}
              rightAdornment={<span>mm</span>}
              fullWidth
              inputProps={{ className: styles.input }}
            />
          </Form.Row>
        </Grid>
        <Grid item xs={12} md={6}>
          <Form.Row>
            <TextField
              name="detailLength2"
              defaultValue={convertDefault(defaultValues["detailLength2"])}
              variant="outlined"
              label="Detail Length"
              helperText="Minimum detail length is 1m"
              getValidationError={getPositiveMinimumValueValidator(
                "detail length",
                1,
                "m",
                "This field should either have a positive number or be left blank"
              )}
              rightAdornment={<span>m</span>}
              fullWidth
              inputProps={{ className: styles.input }}
            />
          </Form.Row>
        </Grid>
      </Grid>
    </Field>
  </FormSection>
);

export default MeasurementsSection;
