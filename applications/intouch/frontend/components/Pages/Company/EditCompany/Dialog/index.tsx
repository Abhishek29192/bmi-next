import get from "lodash.get";
import set from "lodash.set";
import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import {
  UpdateCompanyInput,
  CompanyRegisteredAddressIdFkeyInput,
  CompanyTradingAddressIdFkeyInput
} from "@bmi/intouch-api-types";
import Grid from "@bmi/grid";
import Form from "@bmi/form";
import Dialog from "@bmi/dialog";
import Typography from "@bmi/typography";
import TextField from "@bmi/text-field";
import Select, { MenuItem } from "@bmi/select";
import { useUpdateCompanyDetailsMutation } from "../../../../../graphql/generated/hooks";
import {
  validateEmailInput,
  validatePhoneNumberInput,
  validateUrlInput
} from "../../../../../lib/validations/utils";
import log from "../../../../../lib/logger";
import { GetCompanyQuery } from "../../../../../graphql/generated/operations";
import { BUSINESS_TYPES } from "../../../../../lib/constants";
import { InfoPair } from "../../../../InfoPair";
import { formatCompanyOperations } from "../../RegisteredDetails";
import styles from "./styles.module.scss";

export type OnCompanyUpdate = (company: GetCompanyQuery["company"]) => void;

export type EditCompanyDialogProps = {
  company: GetCompanyQuery["company"];
  isOpen: boolean;
  onCloseClick: () => void;
  onCompanyUpdate: OnCompanyUpdate;
};

export const EditCompanyDialog = ({
  company,
  isOpen,
  onCloseClick,
  onCompanyUpdateSuccess
}: EditCompanyDialogProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  const [updateCompany] = useUpdateCompanyDetailsMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error updating the company: ${error.toString()}`
      });
      // TODO: show some visual error
    },
    onCompleted: ({ updateCompany: { company } }) => {
      log({
        severity: "INFO",
        message: `Updated company - id: ${company.id}`
      });
      onCompanyUpdateSuccess && onCompanyUpdateSuccess(company);
      onCloseClick && onCloseClick();
    }
  });

  const handleSave = useCallback(
    (event, values) => {
      // we need to account for nested objects (e.g. registered address)
      const valuesWithAddresses = Object.entries(values).reduce(
        (obj, [key, value]) => {
          const parsedValue =
            value && key.includes("coordinates")
              ? parseFloat(value as string)
              : value;
          return set(obj, key, parsedValue);
        },
        {}
      );

      const patchWithoutAddresses: Omit<
        UpdateCompanyInput["patch"],
        "registeredAddress" | "tradingAddress"
      > = Object.entries(valuesWithAddresses)
        .filter(
          ([key]) => !["registeredAddress", "tradingAddress"].includes(key)
        )
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      const addressToRegisteredAddressId: CompanyRegisteredAddressIdFkeyInput =
        // address already exists?
        company.registeredAddress.id
          ? {
              // updates the address (already linked to the company)
              updateById: {
                id: company.registeredAddress.id,
                patch: valuesWithAddresses.registeredAddress
              }
            }
          : {
              // creates the address and links it to the company
              create: valuesWithAddresses.registeredAddress
            };

      const addressToTradingAddressId: CompanyTradingAddressIdFkeyInput =
        // address already exists?
        company.tradingAddress.id
          ? {
              // updates the address (already linked to the company)
              updateById: {
                id: company.tradingAddress.id,
                patch: valuesWithAddresses.tradingAddress
              }
            }
          : {
              // creates the address and links it to the company
              create: valuesWithAddresses.tradingAddress
            };

      event.preventDefault();
      updateCompany({
        variables: {
          input: {
            id: company.id,
            patch: {
              ...patchWithoutAddresses,
              addressToTradingAddressId,
              addressToRegisteredAddressId
            }
          }
        }
      });
    },
    [company.id, updateCompany]
  );

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
              <TextField {...getFieldProps("name")} />
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
            <Grid item xs={12} lg={6} spacing={0}>
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

              <InfoPair
                title={t("company-page:edit_dialog.form.fields.operationTypes")}
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

          <Grid container xs={12} alignContent="stretch" spacing={3}>
            {/* TODO: auto-complete address/location https://bmigroup.atlassian.net/browse/IRP-417 */}
            <Grid item xs={12} lg={6} spacing={0}>
              <TextField {...getFieldProps("tradingAddress.firstLine")} />
              <TextField {...getFieldProps("tradingAddress.secondLine")} />
              <TextField {...getFieldProps("tradingAddress.town")} />
              <TextField {...getFieldProps("tradingAddress.postcode")} />
            </Grid>

            <Grid item xs={12} lg={6} spacing={0}>
              <TextField {...getFieldProps("tradingAddress.region")} />
              <TextField {...getFieldProps("tradingAddress.country")} />
              <TextField {...getFieldProps("tradingAddress.coordinates.x")} />
              <TextField {...getFieldProps("tradingAddress.coordinates.y")} />
            </Grid>
          </Grid>

          <Typography variant="h6" className={styles.sectionText}>
            {t("company-page:edit_dialog.sections.contact_details")}
          </Typography>

          <Grid container xs={12} alignContent="stretch" spacing={3}>
            <Grid item xs={12} lg={6} spacing={0}>
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

            <Grid item xs={12} lg={6} spacing={0}>
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
          <Grid container xs={12} alignContent="stretch" spacing={3}>
            <Grid item xs={12} lg={6} spacing={0}>
              <TextField
                {...getFieldProps("ownerPhone")}
                getValidationError={validatePhoneNumber}
              />
            </Grid>

            <Grid item xs={12} lg={6} spacing={0}>
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

export const UPDATE_COMPANY = gql`
  mutation updateCompanyDetails($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        ...CompanyDetailsFragment
      }
    }
  }
`;
