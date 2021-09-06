import React, { useState, useCallback, useContext } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import {
  ProjectSiteAddressIdFkeyInput,
  ProjectCompanyIdFkeyInput
} from "@bmi/intouch-api-types";
import Dialog from "@bmi/dialog";
import Form, { FormContext } from "@bmi/form";
import Grid from "@bmi/grid";
import RadioGroup from "@bmi/radio-group";
import TextField from "@bmi/text-field";
import Icon, { FlatRoof, PitchedRoof } from "@bmi/icon";
import Typography from "@bmi/typography";
import { spreadObjectKeys } from "../../../../lib/utils/object";
import { useCreateProjectMutation } from "../../../../graphql/generated/hooks";
import log from "../../../../lib/logger";
import styles from "./styles.module.scss";

const technologyIcons = {
  FLAT: FlatRoof,
  PITCHED: PitchedRoof
};
const getFieldLabel = (t, fieldName: string) =>
  t(`project-page:addProject.dialog.form.fields.${fieldName}`);
const getFieldValue = (t, fieldName: string, value: string) =>
  t(`project-page:addProject.dialog.form.values.${fieldName}.${value}`);

const getFieldProps = (t, fieldName: string) => ({
  className: styles.input,
  name: fieldName,
  label: getFieldLabel(t, fieldName),
  fullWidth: true,
  fieldIsRequiredError: t("common:error_messages.required")
});

// This is to manage the Radio group not updating form state when items are not direct children
const TechnologyInput = () => {
  const { t } = useTranslation();
  const { updateFormState, values } = useContext(FormContext);

  const handleTechnologyChange = (event) => {
    updateFormState(
      {
        technology: event.target.value
      },
      // No errors
      {}
    );
  };

  return (
    <RadioGroup name="technology" isRequired value={values["technology"]}>
      <Grid container className={styles.technologyGrid}>
        {["PITCHED", "FLAT"].map((technology) => (
          <Grid item md={6} key={technology}>
            <RadioGroup.Item
              name="technology"
              value={technology}
              onChange={handleTechnologyChange}
            >
              <Icon
                source={technologyIcons[technology]}
                className={styles.technologyIcon}
              />
              {getFieldValue(t, "technology", technology)}
            </RadioGroup.Item>
            <Typography variant="caption" component="div">
              {t(
                `project-page:addProject.dialog.form.hints.technology.${technology}`
              )}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};

export type NewProjectDialogProps = {
  companyId: number;
  isOpen: boolean;
  onCloseClick?: () => void;
  onCompleted?: () => void;
};

export const NewProjectDialog = ({
  companyId,
  isOpen,
  onCloseClick,
  onCompleted
}: NewProjectDialogProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createProject] = useCreateProjectMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error creating a project: ${error.toString()}`
      });
      // TODO: show some visual error
      setIsSubmitting(false);
    },
    onCompleted: ({ createProject: { project } }) => {
      log({
        severity: "INFO",
        message: `Created project - id: ${project.id}`
      });

      // Once we can update the cache perhaps we can `shalow: true`
      // at which point closing it makes sense
      onCompleted && onCompleted();
      setIsSubmitting(false);
      router.push(`/projects/${project.id}`, undefined, { shallow: false });
    }
  });

  const onSubmit = useCallback((event, values) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    // we need to account for nested objects (e.g. address)
    const valuesObject = spreadObjectKeys(values, (key, value) => {
      if (key === "roofArea") {
        return Number.parseInt(value);
      }

      return value;
    });

    const { siteAddress, ...createProjectValues } = valuesObject;

    const addressToSiteAddressId: ProjectSiteAddressIdFkeyInput = {
      // creates the address and links it to the project
      create: siteAddress
    };

    const companyToCompanyId: ProjectCompanyIdFkeyInput = {
      connectById: {
        id: companyId
      }
    };

    createProject({
      variables: {
        input: {
          project: {
            ...createProjectValues,
            companyToCompanyId,
            addressToSiteAddressId
          }
        }
      }
    });
  }, []);

  return (
    <Dialog
      className={styles.dialog}
      open={isOpen}
      onCloseClick={onCloseClick}
      disablePortal={false}
    >
      <Dialog.Title hasUnderline>
        {t("project-page:addProject.dialog.title")}
      </Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        <Form className={styles.form} onSubmit={onSubmit} rightAlignButton>
          <Typography variant="h5" className={styles.sectionTitle}>
            {t("project-page:addProject.dialog.sections.projectDetails.title")}
          </Typography>

          <TextField {...getFieldProps(t, "name")} isRequired />

          <div className={styles.input}>
            <Typography variant="h6" className={styles.sectionTitle}>
              {getFieldLabel(t, "technology")}
            </Typography>
            <TechnologyInput />
          </div>

          <TextField
            {...getFieldProps(t, "roofArea")}
            isRequired
            type="number"
            inputProps={{
              min: 1,
              step: 1
            }}
          />

          <TextField {...getFieldProps(t, "description")} isTextArea rows={6} />

          <Typography variant="h6" className={styles.sectionTitle}>
            {t("project-page:addProject.dialog.sections.dates.title")}
          </Typography>
          <Grid container>
            <Grid item sm={6}>
              <TextField
                {...getFieldProps(t, "startDate")}
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
                isRequired
              />
              <TextField
                {...getFieldProps(t, "endDate")}
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
          <TextField
            {...getFieldProps(t, "siteAddress.firstLine")}
            isRequired
          />
          <TextField {...getFieldProps(t, "siteAddress.secondLine")} />
          <TextField {...getFieldProps(t, "siteAddress.town")} isRequired />
          <Grid container>
            <Grid item lg={6}>
              <TextField
                {...getFieldProps(t, "siteAddress.postcode")}
                isRequired
              />
            </Grid>
          </Grid>
          <TextField {...getFieldProps(t, "siteAddress.region")} />
          <TextField {...getFieldProps(t, "siteAddress.country")} isRequired />

          <Form.ButtonWrapper>
            <Form.SubmitButton disabled={isSubmitting}>
              {t("project-page:addProject.dialog.form.actions.submit")}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export const UPDATE_COMPANY = gql`
  mutation createProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      project {
        ...ProjectDetailsFragment
      }
    }
  }
`;
