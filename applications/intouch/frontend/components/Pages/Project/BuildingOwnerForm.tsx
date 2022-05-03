import React from "react";
import { useTranslation } from "next-i18next";
import { Form, FormProps } from "@bmi/components";
import { TextField } from "@bmi/components";
import { Grid } from "@bmi/components";
import { Typography } from "@bmi/components";
import { Project } from "@bmi/intouch-api-types";
import { DeepPartial } from "applications/intouch/frontend/lib/utils/types";
import { findProjectGuarantee } from "../../../lib/utils/project";
import { GetProjectQuery } from "../../../graphql/generated/operations";
// TODO: move/split styles?
import styles from "./CreateProject/styles.module.scss";
import { getValue, isFieldDisabled } from "./Form";

export const getFieldLabel = (t, fieldName: string) =>
  t(`buildingOwnerDetails.edit.form.fields.${fieldName}`);

export const getFieldProps = (t, fieldName: string) => ({
  className: styles.input,
  name: fieldName,
  label: getFieldLabel(t, fieldName),
  fullWidth: true,
  fieldIsRequiredError: t("common:error_messages.required")
});

type BuildingOwnerFormProps = {
  project?: GetProjectQuery["project"];
  onSubmit?: FormProps["onSubmit"];
  isSubmitting?: boolean;
};

const ProjectForm = ({
  project,
  onSubmit,
  isSubmitting
}: BuildingOwnerFormProps) => {
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
      <Typography variant="body1" className={styles.sectionDescription}>
        {t("buildingOwnerDetails.edit.description")}
      </Typography>

      <Grid container xs={12} spacing={0}>
        <Grid item xs={12} lg={6}>
          <Typography variant="h5" className={styles.sectionTitle}>
            {t("buildingOwnerDetails.edit.sections.contactDetails.title")}
          </Typography>
        </Grid>
        <Grid className={styles.sectionRequiredInformation} item xs={12} lg={6}>
          <Typography variant="default" className={styles.requiredInformation}>
            * {t("common:requiredInformation")}
          </Typography>
        </Grid>
      </Grid>

      <TextField {...getFieldPropsFn(t, "buildingOwnerCompany")} />
      <TextField {...getFieldPropsFn(t, "buildingOwnerFirstname")} isRequired />
      <TextField {...getFieldPropsFn(t, "buildingOwnerLastname")} isRequired />
      <TextField {...getFieldPropsFn(t, "buildingOwnerMail")} isRequired />

      <Typography variant="h5" className={styles.sectionTitle}>
        {t("buildingOwnerDetails.edit.sections.buildingOwnerAddress.title")}
      </Typography>

      <TextField
        {...getFieldPropsFn(t, "buildingOwnerAddress.firstLine")}
        isRequired
      />
      <TextField {...getFieldPropsFn(t, "buildingOwnerAddress.secondLine")} />
      <TextField
        {...getFieldPropsFn(t, "buildingOwnerAddress.town")}
        isRequired
      />
      <Grid container>
        <Grid item lg={6}>
          <TextField
            {...getFieldPropsFn(t, "buildingOwnerAddress.postcode")}
            isRequired
          />
        </Grid>
      </Grid>
      <TextField {...getFieldPropsFn(t, "buildingOwnerAddress.region")} />
      <TextField
        {...getFieldPropsFn(t, "buildingOwnerAddress.country")}
        isRequired
      />

      <Form.ButtonWrapper>
        <Form.SubmitButton disabled={isSubmitting}>
          {t("buildingOwnerDetails.edit.form.actions.submit")}
        </Form.SubmitButton>
      </Form.ButtonWrapper>
    </Form>
  );
};

export default ProjectForm;
