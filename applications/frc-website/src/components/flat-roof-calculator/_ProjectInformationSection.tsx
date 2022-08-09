import { Form, Grid, TextField } from "@bmi/components";
import React from "react";
import styles from "./FlatRoofCalculator.module.scss";
import { maxLengthValidator } from "./utils/maxLengthValidator";
import FormSection from "./_FormSection";

export const ProjectInformationSection = ({ header, defaultValues }: any) => (
  <FormSection header={header}>
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Form.Row>
          <TextField
            name="companyName"
            defaultValue={defaultValues["companyName"]}
            variant="outlined"
            label="Company Name"
            fullWidth
            getValidationError={maxLengthValidator(50)}
            inputProps={{ className: styles.input }}
          />
        </Form.Row>
      </Grid>
    </Grid>
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Form.Row>
          <TextField
            name="projectName"
            defaultValue={defaultValues["projectName"]}
            variant="outlined"
            label="Project Name"
            fullWidth
            getValidationError={maxLengthValidator(50)}
            inputProps={{ className: styles.input }}
          />
        </Form.Row>
      </Grid>
    </Grid>
  </FormSection>
);
