import React, { useCallback, useRef } from "react";
import set from "lodash.set";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import Grid from "@bmi/grid";
import Form from "@bmi/form";
import Dialog from "@bmi/dialog";
import Typography from "@bmi/typography";
import TextField from "@bmi/text-field";
import Select, { MenuItem } from "@bmi/select";
import {
  useCreateCompanyMutation,
  useCreateAddressMutation
} from "../../../../../graphql/generated/hooks";
import {
  validateEmailInput,
  validatePhoneNumberInput,
  validateUrlInput
} from "../../../../../lib/validations/utils";
import log from "../../../../../lib/logger";
import { BUSINESS_TYPES } from "../../../../../lib/constants";
import styles from "./styles.module.scss";

export type RegisterCompanyDialogProps = {
  isOpen: boolean;
  onCloseClick?: () => void;
};

export const RegisterCompanyDialog = ({
  isOpen,
  onCloseClick
}: RegisterCompanyDialogProps) => {
  const { t } = useTranslation(["common", "company-page"]);

  const [createAddress] = useCreateAddressMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error creating a the company: ${error.toString()}`
      });
      // TODO: show some visual error
    },
    onCompleted: ({ createAddress: { address } }) => {
      log({
        severity: "INFO",
        message: `Created Address - id: ${address.id}`
      });
    }
  });

  const createdCompanyId = useRef<number>();

  const [registerCompany] = useCreateCompanyMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error creating a company: ${error.toString()}`
      });
      // TODO: show some visual error
    },
    onCompleted: ({ createCompany: { company } }) => {
      log({
        severity: "INFO",
        message: `Registered company - id: ${company.id}`
      });

      createdCompanyId.current = company.id;
    }
  });

  const handleSave = useCallback(async (event, values) => {
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

    const { registeredAddress, tradingAddress, ...company } =
      valuesWithAddresses;

    event.preventDefault();
    await registerCompany({
      variables: {
        // TODO: Not sure if this is solid type wise
        input: company
      }
    });

    if (createdCompanyId.current) {
      await createAddress({
        variables: {
          input: {
            address: {
              ...registeredAddress,
              companiesToRegisteredAddressIdUsingId: {
                connectById: {
                  id: createdCompanyId.current
                }
              }
            }
          }
        }
      });

      await createAddress({
        variables: {
          input: {
            address: {
              ...tradingAddress,
              companiesToTradingAddressIdUsingId: {
                connectById: {
                  id: createdCompanyId.current
                }
              }
            }
          }
        }
      });
    }

    createdCompanyId.current = null;
    window.location.reload();
  }, []);

  const getFieldProps = useCallback(
    (fieldName: string) => ({
      className: styles.input,
      name: fieldName,
      label: t(`company-page:edit_dialog.form.fields.${fieldName}`),
      fullWidth: true,
      fieldIsRequiredError: t("common:error_messages.required")
    }),
    []
  );

  const validateUrl = useCallback(validateUrlInput(t), [t]);
  const validateEmail = useCallback(validateEmailInput(t), [t]);
  const validatePhoneNumber = useCallback(validatePhoneNumberInput(t), [t]);

  return (
    <Dialog className={styles.dialog} open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>
        {t("company-page:register_dialog.title")}
      </Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        <Form className={styles.form} onSubmit={handleSave} rightAlignButton>
          <Typography variant="h6" className={styles.sectionText}>
            {t("company-page:edit_dialog.sections.registered_details")}
          </Typography>
          <Grid container xs={12} alignContent="stretch" spacing={3}>
            <Grid item xs={12} lg={6} spacing={0}>
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

export const CREATE_COMPANY = gql`
  mutation createCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      company {
        id
      }
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation createAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      address {
        id
      }
    }
  }
`;
