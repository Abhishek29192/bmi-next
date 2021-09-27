import React from "react";
import get from "lodash/get";
import { useTranslation } from "next-i18next";
import { Project } from "@bmi/intouch-api-types";
import Form, { FormProps } from "@bmi/form";
import TextField from "@bmi/text-field";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import { getDateOnlyString } from "../../../lib/utils/date";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import TechnologyInput from "./TechnologyInput";
// TODO: move/split styles?
import styles from "./CreateProject/styles.module.scss";

export const getFieldLabel = (t, fieldName: string) =>
  t(`project-page:addProject.dialog.form.fields.${fieldName}`);
export const getFieldValueLabel = (t, fieldName: string, value: string) =>
  t(`project-page:addProject.dialog.form.values.${fieldName}.${value}`);

export const getFieldProps = (t, fieldName: string) => ({
  className: styles.input,
  name: fieldName,
  label: getFieldLabel(t, fieldName),
  fullWidth: true,
  fieldIsRequiredError: t("common:error_messages.required")
});

type ProjectFormProps = {
  project?: GetProjectQuery["project"];
  onSubmit?: FormProps["onSubmit"];
  isSubmitting?: boolean;
};

const getValue = (project, fieldName) => {
  if (["startDate", "endDate"].includes(fieldName)) {
    return getDateOnlyString(get(project, fieldName));
  }

  return get(project, fieldName);
};

const ProjectForm = ({ project, onSubmit, isSubmitting }: ProjectFormProps) => {
  const { t } = useTranslation("project-page");

  let getFieldPropsFn = project
    ? (t, fieldName) => {
        return {
          ...getFieldProps(t, fieldName),
          defaultValue: getValue(project, fieldName)
        };
      }
    : getFieldProps;

  return (
    <Form className={styles.form} onSubmit={onSubmit} rightAlignButton>
      <Typography variant="h5" className={styles.sectionTitle}>
        {t("project-page:addProject.dialog.sections.projectDetails.title")}
      </Typography>

      <TextField {...getFieldPropsFn(t, "name")} isRequired />

      <div className={styles.input}>
        <Typography variant="h6" className={styles.sectionTitle}>
          {getFieldLabel(t, "technology")}
        </Typography>
        <TechnologyInput defaultValue={project?.technology} />
      </div>

      <TextField
        {...getFieldPropsFn(t, "roofArea")}
        isRequired
        type="number"
        inputProps={{
          min: 1,
          step: 1
        }}
      />

      <TextField {...getFieldPropsFn(t, "description")} isTextArea rows={6} />

      <Typography variant="h6" className={styles.sectionTitle}>
        {t("project-page:addProject.dialog.sections.dates.title")}
      </Typography>
      <Grid container>
        <Grid item sm={6}>
          <TextField
            {...getFieldPropsFn(t, "startDate")}
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            isRequired
          />
          <TextField
            {...getFieldPropsFn(t, "endDate")}
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            isRequired
          />
        </Grid>
      </Grid>

      <Typography variant="h5" className={styles.sectionTitle}>
        {t("project-page:addProject.dialog.sections.siteAddress.title")}
      </Typography>
      <TextField {...getFieldPropsFn(t, "siteAddress.firstLine")} isRequired />
      <TextField {...getFieldPropsFn(t, "siteAddress.secondLine")} />
      <TextField {...getFieldPropsFn(t, "siteAddress.town")} isRequired />
      <Grid container>
        <Grid item lg={6}>
          <TextField
            {...getFieldPropsFn(t, "siteAddress.postcode")}
            isRequired
          />
        </Grid>
      </Grid>
      <TextField {...getFieldPropsFn(t, "siteAddress.region")} />
      <TextField {...getFieldPropsFn(t, "siteAddress.country")} isRequired />

      <Form.ButtonWrapper>
        <Form.SubmitButton disabled={isSubmitting}>
          {t("project-page:addProject.dialog.form.actions.submit")}
        </Form.SubmitButton>
      </Form.ButtonWrapper>
    </Form>
  );
};

export default ProjectForm;
