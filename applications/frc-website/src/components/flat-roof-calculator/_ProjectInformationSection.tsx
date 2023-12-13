import Form from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import TextField from "@bmi-digital/components/text-field";
import React from "react";
import FormSection from "./_FormSection";
import { maxLengthValidator } from "./utils/maxLengthValidator";

export const ProjectInformationSection = ({ header, defaultValues }: any) => (
  <FormSection header={header}>
    <Grid container spacing={3}>
      <Grid xs={6}>
        <Form.Row>
          <TextField
            name="companyName"
            defaultValue={defaultValues["companyName"]}
            variant="outlined"
            label="Company Name"
            fullWidth
            getValidationError={maxLengthValidator(50)}
            inputProps={{ className: "input" }}
          />
        </Form.Row>
      </Grid>
    </Grid>
    <Grid container spacing={3}>
      <Grid xs={6}>
        <Form.Row>
          <TextField
            name="projectName"
            defaultValue={defaultValues["projectName"]}
            variant="outlined"
            label="Project Name"
            fullWidth
            getValidationError={maxLengthValidator(50)}
            inputProps={{ className: "input" }}
          />
        </Form.Row>
      </Grid>
    </Grid>
  </FormSection>
);
