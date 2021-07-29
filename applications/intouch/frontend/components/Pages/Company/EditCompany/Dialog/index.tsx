import React from "react";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import Grid from "@bmi/grid";
import Form from "@bmi/form";
import Dialog from "@bmi/dialog";
import Typography from "@bmi/typography";
import TextField from "@bmi/text-field";
import Select, { MenuItem } from "@bmi/select";
import { useUpdateCompanyDetailsMutation } from "../../../../graphql/generated/hooks";
import { GetCompanyQuery } from "../../../../../graphql/generated/operations";
import { BUSINESS_TYPES } from "../../../../../lib/constants";
import { InfoPair } from "../../../../InfoPair";
import { formatCompanyOperations } from "../../RegisteredDetails";
import styles from "./styles.module.scss";

export const EditCompanyDialog = ({
  company,
  isOpen,
  onCloseClick
}: {
  company: GetCompanyQuery["company"];
  isOpen: boolean;
  onCloseClick: () => void;
}) => {
  const { t } = useTranslation(["common", "company-page"]);
  const [updateCompany] = useUpdateCompanyDetailsMutation();

  // TODO: form event or MouseEvent
  const handleSave = (event, values) => {
    event.preventDefault();
    updateCompany({
      variables: {
        input: {
          id: company.id,
          patch: values
        }
      }
    });
    onCloseClick();
  };

  return (
    <Dialog className={styles.dialog} open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>
        {t("company-page:edit_dialog.title")}
      </Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        <Form className={styles.form} onSubmit={handleSave} rightAlignButton>
          <Typography variant="h6" className={styles.sectionText}>
            {t("company-page:edit_dialog.sections.registered_details")}
          </Typography>
          <Grid container xs={12} alignContent="stretch" spacing={3}>
            <Grid item xs={12} lg={6} spacing={0}>
              <TextField
                className={styles.input}
                name="name"
                isRequired
                label={t("company-page:edit_dialog.form.fields.name")}
                fullWidth
              />

              <TextField
                className={styles.input}
                name="registeredAddress.addressLine1"
                isRequired
                label={t("company-page:edit_dialog.form.fields.address_line_1")}
                fullWidth
              />
              <TextField
                className={styles.input}
                name="registeredAddress.addressLine2"
                isRequired
                label={t("company-page:edit_dialog.form.fields.address_line_2")}
                fullWidth
              />

              <TextField
                className={styles.input}
                name="registeredAddress.town"
                isRequired
                label={t("company-page:edit_dialog.form.fields.town")}
                fullWidth
              />

              <TextField
                className={styles.input}
                name="registeredAddress.postCode"
                isRequired
                label={t("company-page:edit_dialog.form.fields.post_code")}
                fullWidth
              />

              <TextField
                className={styles.input}
                name="registeredAddress.region"
                isRequired
                label={t("company-page:edit_dialog.form.fields.region")}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} lg={6} spacing={0}>
              <TextField
                className={styles.input}
                name="registeredAddress.country"
                isRequired
                label={t("company-page:edit_dialog.form.fields.country")}
                fullWidth
              />

              <TextField
                className={styles.input}
                name="registeredAddress.taxCode"
                isRequired
                label={t("company-page:edit_dialog.form.fields.tax_number")}
                fullWidth
              />

              <Select
                className={styles.input}
                isRequired
                label={t("company-page:edit_dialog.form.fields.business_type")}
                name="businessType"
              >
                {Object.entries(BUSINESS_TYPES).map(([key, businessType]) => (
                  <MenuItem key={key} value={businessType}>
                    {t(`company-page:business_type.${businessType}`)}
                  </MenuItem>
                ))}
              </Select>

              <InfoPair
                title={t(
                  "company-page:edit_dialog.form.fields.operation_types"
                )}
              >
                {formatCompanyOperations(
                  t,
                  company.companyOperationsByCompany.nodes.map(
                    (node) => node.operation
                  )
                )}
              </InfoPair>
              {/* TODO: check that only market admin & super admin can change company operations */}

              <InfoPair title={t("company-page:edit_dialog.form.fields.tier")}>
                {t(`common:tier.${company.tier}`)}
              </InfoPair>
              {/* TODO: check that only market admin & super admin can change company tier */}
            </Grid>
          </Grid>

          <TextField
            className={styles.input}
            name="aboutUs"
            isRequired
            label={t("company-page:edit_dialog.form.fields.description")}
            fullWidth
            isTextArea
            rows={6}
          />
          <Form.Row>
            <Typography variant="h6" className={styles.sectionText}>
              {t("company-page:edit_dialog.sections.trading_address")}
            </Typography>

            <Typography className={styles.sectionText}>
              {t(
                "company-page:edit_dialog.sections.trading_address_description"
              )}
            </Typography>
          </Form.Row>

          <Typography variant="h6" className={styles.sectionText}>
            {t("company-page:edit_dialog.sections.contact_details")}
          </Typography>

          <Grid container xs={12} alignContent="stretch" spacing={3}>
            <Grid item xs={12} lg={6} spacing={0}>
              <TextField
                className={styles.input}
                name="phone"
                // TODO: country flag
                label="Phone (optional)"
                fullWidth
              />
              <TextField
                className={styles.input}
                name="website"
                label={t("company-page:edit_dialog.form.fields.website")}
                fullWidth
              />
              <TextField
                className={styles.input}
                name="facebook"
                label={t("company-page:edit_dialog.form.fields.facebook")}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} lg={6} spacing={0}>
              <TextField
                className={styles.input}
                name="email"
                label={t("company-page:edit_dialog.form.fields.email")}
                fullWidth
              />
              <TextField
                className={styles.input}
                name="linkedin"
                label={t("company-page:edit_dialog.form.fields.linkedin")}
                fullWidth
              />
            </Grid>
          </Grid>

          <Typography variant="h6" className={styles.sectionText}>
            {t("company-page:edit_dialog.sections.owner_details")}
          </Typography>

          <Grid item xs={12} lg={6} spacing={0}>
            <TextField
              className={styles.input}
              name="phone"
              // TODO: country flag
              label="Phone (optional)"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={6} spacing={0}>
            <TextField
              className={styles.input}
              name="ownerEmail"
              label={t("company-page:edit_dialog.form.fields.email")}
              fullWidth
            />
          </Grid>

          <Form.ButtonWrapper>
            <Form.SubmitButton>
              {t("company-page:edit_dialog.form.actions.submit")}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export const UPDATE_COMPANY = gql`
  mutation updateCompanyDetails($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        ...CompanyDetailsFragment
      }
    }
  }
`;
