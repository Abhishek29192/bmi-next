import {
  Form,
  FormProps,
  Grid,
  TextField,
  Typography
} from "@bmi-digital/components";
import { Guarantee, Project } from "@bmi/intouch-api-types";
import { DeepPartial } from "applications/intouch/frontend/lib/utils/types";
import { useTranslation } from "next-i18next";
import React from "react";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { getDateOnlyString } from "../../../lib/utils/date";
import { getNestedValue } from "../../../lib/utils/object";
import { findProjectGuarantee } from "../../../lib/utils/project";
// TODO: move/split styles?
import styles from "./CreateProject/styles.module.scss";
import TechnologyInput from "./TechnologyInput";

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

export const getValue = (project, fieldName) => {
  if (["startDate", "endDate"].includes(fieldName)) {
    return getDateOnlyString(getNestedValue(project, fieldName));
  }

  return getNestedValue(project, fieldName);
};

// If there is a guarantee present, cannot edit these fields
const disabledFields = [
  "name",
  "description",
  "roofArea",
  "startDate",
  "endDate",
  "siteAddress.firstLine",
  "siteAddress.secondLine",
  "siteAddress.town",
  "siteAddress.postcode",
  "siteAddress.region",
  "siteAddress.country"
];

export const isFieldDisabled = (
  guarantee: Pick<Guarantee, "status">,
  fieldName: string
) => {
  if (!guarantee) {
    return false;
  }

  // Cannot change technology as soon as there is a guarantee in progress
  if (guarantee && fieldName === "technology") {
    return true;
  }

  if (["APPROVED", "SUBMITTED", "REVIEW"].includes(guarantee.status)) {
    return disabledFields.includes(fieldName);
  }

  return false;
};

type ProjectFormProps = {
  project?: GetProjectQuery["project"];
  onSubmit?: FormProps["onSubmit"];
  isSubmitting?: boolean;
};

const ProjectForm = ({ project, onSubmit, isSubmitting }: ProjectFormProps) => {
  const { t } = useTranslation(["project-page", "common"]);

  const guarantee = findProjectGuarantee(project as DeepPartial<Project>);

  const getFieldPropsFn = project
    ? (t, fieldName) => {
        return {
          ...getFieldProps(t, fieldName),
          defaultValue: getValue(project, fieldName),
          disabled: isFieldDisabled(guarantee, fieldName)
        };
      }
    : getFieldProps;

  return (
    <Form className={styles.form} onSubmit={onSubmit} rightAlignButton>
      <Grid nonce={undefined} container xs={12} spacing={3}>
        <Grid nonce={undefined} item xs={12} lg={6}>
          <Typography variant="h5" className={styles.sectionTitle}>
            {t("project-page:addProject.dialog.sections.projectDetails.title")}
          </Typography>
        </Grid>
        <Grid nonce={undefined} item xs={12} lg={6}>
          <Typography variant="default" className={styles.requiredInformation}>
            * {t("common:requiredInformation")}
          </Typography>
        </Grid>
      </Grid>
      <TextField {...getFieldPropsFn(t, "name")} isRequired />

      <div className={styles.input}>
        <Typography variant="h6" className={styles.sectionTitle}>
          {getFieldLabel(t, "technology")}
        </Typography>
        <TechnologyInput {...getFieldPropsFn(t, "technology")} isRequired />
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
      <Grid nonce={undefined} container>
        <Grid nonce={undefined} item sm={6}>
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
      <Grid nonce={undefined} container>
        <Grid nonce={undefined} item lg={6}>
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
