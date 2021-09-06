import get from "lodash/get";
import set from "lodash/set";
import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { CompanyOperation } from "@bmi/intouch-api-types";
import Grid from "@bmi/grid";
import Form from "@bmi/form";
import Dialog from "@bmi/dialog";
import Typography from "@bmi/typography";
import TextField from "@bmi/text-field";
import Select, { MenuItem } from "@bmi/select";
import { useMarketContext } from "../../context/MarketContext";
import {
  validateEmailInput,
  validatePhoneNumberInput,
  validateUrlInput
} from "../../lib/validations/utils";
import { GetCompanyQuery } from "../../graphql/generated/operations";
import { BUSINESS_TYPES } from "../../lib/constants";
import { InfoPair } from "../InfoPair";
import { ProfilePictureUpload } from "../ProfilePictureUpload";
import { formatCompanyOperations } from "../Pages/Company/RegisteredDetails";
import { SetTradingAddress } from "./SetTradingAddress";
import styles from "./styles.module.scss";

export type OnCompanyUpdateSuccess = (
  company: GetCompanyQuery["company"]
) => void;

export type SetCompanyDetailsDialogProps = {
  title: string;
  company?: GetCompanyQuery["company"];
  isOpen: boolean;
  onCloseClick: () => void;
  onSubmit: (values: { [key: string]: any }) => any;
};

export const SetCompanyDetailsDialog = ({
  title,
  company,
  isOpen,
  onCloseClick,
  onSubmit
}: SetCompanyDetailsDialogProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  const { market } = useMarketContext();

  const [shouldRemoveLogo, setShouldRemoveLogo] = useState(false);
  const [logoUpload, setLogoUpload] = useState(undefined);

  const onProfilePictureChange = (file) => {
    setShouldRemoveLogo(!file);
    setLogoUpload(file);
  };

  const handleSubmit = useCallback(
    (event, values) => {
      event.preventDefault();
      // we need to account for nested objects (e.g. registered address)
      const valuesWithAddresses = Object.entries(values).reduce(
        (obj, [key, value]) => {
          if (value === undefined) {
            return obj;
          }
          return set(
            obj,
            key,
            key.includes("coordinates") && !isNaN(parseFloat(value as string))
              ? parseFloat(value as string)
              : value
          );
        },
        {}
      );

      onSubmit({
        ...valuesWithAddresses,
        logoUpload,
        shouldRemoveLogo
      });
    },
    [company, onSubmit, logoUpload, shouldRemoveLogo]
  );

  const initialPictureUrl = company?.logo;

  const getFieldProps = useCallback(
    (fieldName: string) => ({
      className: styles.input,
      name: fieldName,
      label: t(`company-page:edit_dialog.form.fields.${fieldName}`),
      defaultValue: get(company, fieldName),
      fullWidth: true,
      fieldIsRequiredError: t("common:error_messages.required")
    }),
    [company]
  );

  const validateUrl = useCallback(validateUrlInput(t), [t]);
  const validateEmail = useCallback(validateEmailInput(t), [t]);
  const validatePhoneNumber = useCallback(validatePhoneNumberInput(t), [t]);

  const operations = (get(company, "companyOperationsByCompany.nodes") ||
    []) as CompanyOperation[];

  return (
    <Dialog className={styles.dialog} open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>{title}</Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        <Form className={styles.form} onSubmit={handleSubmit} rightAlignButton>
          <Typography variant="h6" className={styles.sectionText}>
            {t("company-page:edit_dialog.sections.registered_details")}
          </Typography>
          <Grid container xs={12} spacing={3}>
            <Grid item xs={12} lg={6}>
              <TextField {...getFieldProps("name")} isRequired />
              <TextField
                {...getFieldProps("registeredAddress.firstLine")}
                isRequired
              />
              <TextField {...getFieldProps("registeredAddress.secondLine")} />
              <TextField
                {...getFieldProps("registeredAddress.town")}
                isRequired
              />
              <TextField
                {...getFieldProps("registeredAddress.postcode")}
                isRequired
              />
              <TextField {...getFieldProps("registeredAddress.region")} />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                {...getFieldProps("registeredAddress.country")}
                isRequired
              />
              <TextField {...getFieldProps("taxNumber")} isRequired />

              <Select {...getFieldProps("businessType")} isRequired>
                {Object.entries(BUSINESS_TYPES).map(([key, businessType]) => (
                  <MenuItem key={key} value={businessType}>
                    {t(`company-page:businessType.${businessType}`)}
                  </MenuItem>
                ))}
              </Select>

              {operations?.length > 0 ? (
                <InfoPair
                  title={t(
                    "company-page:edit_dialog.form.fields.operationTypes"
                  )}
                >
                  {formatCompanyOperations(
                    t,
                    operations.map((node) => node.operation)
                  )}
                </InfoPair>
              ) : null}

              {company?.tier ? (
                <InfoPair
                  title={t("company-page:edit_dialog.form.fields.tier")}
                >
                  {t(`common:tier.${company.tier}`)}
                </InfoPair>
              ) : null}
            </Grid>
          </Grid>

          <ProfilePictureUpload
            variant="square"
            title={t("company-page:edit_dialog.form.fields.logo.label")}
            uploadPictureLabel={t(
              "company-page:edit_dialog.form.fields.logo.buttons.upload"
            )}
            removePictureLabel={t(
              "company-page:edit_dialog.form.fields.logo.buttons.remove"
            )}
            altText={"company-page:edit_dialog.form.fields.logo.alt_text"}
            initialPictureUrl={initialPictureUrl as string | undefined}
            onChange={(file) => {
              onProfilePictureChange(file);
            }}
            fileTypesMessage={t(
              "company-page:edit_dialog.form.fields.logo.fileTypesMessage"
            )}
            fileSizeMessage={t(
              "company-page:edit_dialog.form.fields.logo.fileSizeMessage"
            )}
          />

          <TextField {...getFieldProps("aboutUs")} isTextArea rows={6} />
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

          <SetTradingAddress
            existingTradingAddress={company?.tradingAddress}
            marketCenterPoint={market.geoMiddle}
            locationBiasRadiusKm={market.locationBiasRadiusKm}
          />

          <Typography variant="h6" className={styles.sectionText}>
            {t("company-page:edit_dialog.sections.contact_details")}
          </Typography>

          <Grid container xs={12} alignContent="stretch" spacing={3}>
            <Grid item xs={12} lg={6}>
              <TextField
                {...getFieldProps("phone")}
                getValidationError={validatePhoneNumber}
              />
              <TextField
                {...getFieldProps("website")}
                getValidationError={validateUrl}
              />
              <TextField
                {...getFieldProps("facebook")}
                getValidationError={validateUrl}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                {...getFieldProps("publicEmail")}
                getValidationError={validateEmail}
              />
              <TextField
                {...getFieldProps("linkedIn")}
                getValidationError={validateUrl}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" className={styles.sectionText}>
            {t("company-page:edit_dialog.sections.owner_details")}
          </Typography>

          <Grid container xs={12} spacing={3}>
            <Grid item xs={12} lg={6}>
              <TextField
                {...getFieldProps("ownerPhone")}
                getValidationError={validatePhoneNumber}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                {...getFieldProps("ownerEmail")}
                getValidationError={validateEmail}
              />
            </Grid>
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
