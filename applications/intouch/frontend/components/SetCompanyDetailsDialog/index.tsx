import { gql } from "@apollo/client";
import {
  AlertBanner,
  Checkbox,
  Dialog,
  Form,
  Grid,
  Select,
  SelectMenuItem,
  TextField,
  Typography
} from "@bmi/components";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMarketContext } from "../../context/MarketContext";
import { useGetTierBenefitQuery } from "../../graphql/generated/hooks";
import { GetCompanyQuery } from "../../graphql/generated/operations";
import { BUSINESS_TYPES } from "../../lib/constants";
import AccessControl from "../../lib/permissions/AccessControl";
import { getNestedValue, spreadObjectKeys } from "../../lib/utils/object";
import {
  validateEmailInput,
  validatePhoneNumberInput,
  validateUrlInput
} from "../../lib/validations/utils";
import { InfoPair } from "../InfoPair";
import { ProfilePictureUpload } from "../ProfilePictureUpload";
import { parseMarketTag } from "../../lib/utils";
import { getDateOnlyString } from "../../lib/utils/date";
import { SetCompanyOperations } from "./SetCompanyOperations";
import { SetTradingAddress } from "./SetTradingAddress";
import styles from "./styles.module.scss";

export type OnCompanyUpdateSuccess = (
  company: GetCompanyQuery["company"]
) => void;

export type SetCompanyDetailsDialogProps = {
  title: string;
  company?: GetCompanyQuery["company"];
  isOpen: boolean;
  loading: boolean;
  onCloseClick: () => void;
  onSubmit: (values: { [key: string]: any }) => any;
  errorMessage?: string;
  mapsApiKey: string;
};
export const MAX_FILE_SIZE = 3;

const getValue = (company, fieldName) => {
  if (["renewalDate"].includes(fieldName)) {
    return getDateOnlyString(getNestedValue(company, fieldName));
  }

  return getNestedValue(company, fieldName) || "";
};

export const SetCompanyDetailsDialog = ({
  title,
  company,
  isOpen,
  onCloseClick,
  onSubmit,
  errorMessage,
  mapsApiKey,
  loading
}: SetCompanyDetailsDialogProps) => {
  const { t } = useTranslation(["common", "company-page"]);
  const { market } = useMarketContext();
  const contentfulTag = parseMarketTag(market?.domain);
  const { data: getTierBenefit } = useGetTierBenefitQuery({
    variables: { tag: contentfulTag }
  });

  const [shouldRemoveLogo, setShouldRemoveLogo] = useState(false);
  const [logoUpload, setLogoUpload] = useState(undefined);
  const [fileSizeRestriction, setFileSizeRestriction] = useState(false);
  const [fileValidationMessage, setFileValidationMessage] = useState("");

  // Contract status and renewal date.
  const [contractStatus, setContractStatus] = useState(company?.contractStatus);
  const [renewalDate, setRenewalDate] = useState(company?.renewalDate);

  const [contractRestriction, setContractRestriction] = useState(false);
  const [contractValidationMessage, setContractValidationMessage] =
    useState("");

  const onContractValidationException = (
    restriction: boolean,
    message: string
  ) => {
    setContractRestriction(restriction);
    setContractValidationMessage(message);
  };

  useEffect(() => {
    const today = new Date();
    const d = new Date(renewalDate);
    const isValid =
      !contractStatus || (renewalDate !== null && contractStatus && d > today);
    isValid
      ? onContractValidationException(false, "")
      : onContractValidationException(
          true,
          t(`company-page:edit_dialog.form.renewalDate`)
        );
  }, [company, isOpen, renewalDate, contractStatus]);

  useEffect(() => {
    setContractStatus(company?.contractStatus);
    setRenewalDate(company?.renewalDate);
  }, [company, isOpen]);

  // You cannot upload files larger than <MAX_FILE_SIZE> MB (It's megabyte)

  const onValidationException = (restriction: boolean, message: string) => {
    setFileSizeRestriction(restriction);
    setFileValidationMessage(message);
  };

  const onProfilePictureChange = (file) => {
    setShouldRemoveLogo(!file);
    setLogoUpload(file);

    onValidationException(false, "");

    if (file.size > MAX_FILE_SIZE * (1024 * 1024)) {
      onValidationException(
        true,
        `${t(
          "company-page:edit_dialog.form.fields.logo.fileSizeValidationMessage"
        )} ${MAX_FILE_SIZE}MB`
      );
    }
  };

  const operations = useMemo(() => {
    return company?.companyOperationsByCompany.nodes || [];
  }, [company]);

  const tierBenefits = useMemo(() => {
    return getTierBenefit?.tierBenefitCollection.items || [];
  }, [getTierBenefit]);

  const tierName = useMemo(() => {
    const tierBenefit = getTierBenefit?.tierBenefitCollection.items.find(
      ({ tier: tierBenefit }) => {
        return tierBenefit === company?.tier;
      }
    );
    return tierBenefit?.name || null;
  }, [getTierBenefit, company?.tier]);

  const handleSubmit = useCallback(
    (event, values) => {
      event.preventDefault();
      // we need to account for nested objects (e.g. registered address)
      const valuesWithAddresses = spreadObjectKeys(values, (key, value) => {
        return key.includes("coordinates") &&
          !isNaN(parseFloat(value as string))
          ? parseFloat(value as string)
          : value;
      });

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
      // eslint-disable-next-line security/detect-object-injection
      defaultValue: getValue(company, fieldName),
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
      <Dialog.Title hasUnderline>{title}</Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        {errorMessage && (
          <AlertBanner severity={"error"}>
            <AlertBanner.Title>
              {t(`company-page:${errorMessage}`)}
            </AlertBanner.Title>
          </AlertBanner>
        )}

        <Form
          className={styles.form}
          onSubmit={handleSubmit}
          rightAlignButton
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          data-testid="company-details-form"
        >
          <Grid container xs={12} spacing={3}>
            <Grid item xs={12} lg={6}>
              <Typography variant="h6" className={styles.sectionText}>
                {t("company-page:edit_dialog.sections.registered_details")}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography
                variant="default"
                className={styles.requiredInformation}
              >
                * {t("common:requiredInformation")}
              </Typography>
            </Grid>
          </Grid>
          <Grid container xs={12} spacing={3}>
            <Grid item xs={12} lg={6}>
              <TextField {...getFieldProps("name")} isRequired />
              <TextField
                {...getFieldProps("registeredAddress.firstLine")}
                autoComplete="off"
                isRequired
              />
              <TextField
                {...getFieldProps("registeredAddress.secondLine")}
                autoComplete="off"
              />
              <TextField
                {...getFieldProps("registeredAddress.town")}
                autoComplete="off"
                isRequired
              />
              <TextField
                {...getFieldProps("registeredAddress.postcode")}
                autoComplete="off"
                isRequired
              />
              <TextField
                {...getFieldProps("registeredAddress.region")}
                autoComplete="off"
              />

              <TextField
                {...getFieldProps("registeredAddress.country")}
                isRequired
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField {...getFieldProps("taxNumber")} isRequired />

              <Select {...getFieldProps("businessType")} isRequired>
                {Object.entries(BUSINESS_TYPES).map(([key, businessType]) => (
                  <SelectMenuItem key={key} value={businessType}>
                    {t(`company-page:businessType.${businessType}`)}
                  </SelectMenuItem>
                ))}
              </Select>

              <SetCompanyOperations operations={operations} />

              <AccessControl
                action="editTier"
                dataModel="company"
                fallbackView={
                  tierName ? (
                    <InfoPair
                      title={t("company-page:edit_dialog.form.fields.tier")}
                    >
                      {tierName}
                    </InfoPair>
                  ) : null
                }
              >
                <Select {...getFieldProps("tier")} isRequired>
                  {tierBenefits.length &&
                    tierBenefits.map(({ tier, name }) => (
                      <SelectMenuItem key={tier} value={tier}>
                        {name}
                      </SelectMenuItem>
                    ))}
                </Select>
              </AccessControl>
            </Grid>
          </Grid>

          <Form.Row>
            <Typography variant="h6" className={styles.sectionText}>
              {t("company-page:edit_dialog.sections.contract_status")}
            </Typography>
          </Form.Row>

          <Grid container xs={12} spacing={3}>
            <Grid item xs={12} lg={6}>
              <Checkbox
                {...getFieldProps("contractStatus")}
                defaultChecked={company?.contractStatus}
                defaultValue={company?.contractStatus}
                onChange={(checked) => setContractStatus(checked)}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                {...getFieldProps("renewalDate")}
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(val) => setRenewalDate(val)}
              />
              <Typography
                variant="default"
                className={styles.validationMessage}
              >
                {contractValidationMessage}
              </Typography>
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
            fileValidationMessage={fileValidationMessage}
          />

          <TextField
            {...getFieldProps("aboutUs")}
            isTextArea
            rows={6}
            inputProps={{
              maxLength: 255
            }}
            helperText={t(`company-page:edit_dialog.form.maxCharacters`)}
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

          <SetTradingAddress
            existingTradingAddress={company?.tradingAddress}
            marketCenterPoint={market.geoMiddle}
            locationBiasRadiusKm={market.locationBiasRadiusKm}
            mapsApiKey={mapsApiKey}
          />

          <Typography variant="h6" className={styles.sectionText}>
            {t("company-page:edit_dialog.sections.contact_details")}
          </Typography>

          <Grid container xs={12} alignContent="stretch" spacing={3}>
            <Grid item xs={12} lg={6}>
              <TextField
                {...getFieldProps("phone")}
                type="tel"
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
                {...getFieldProps("ownerFullname")}
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                {...getFieldProps("ownerPhone")}
                type="tel"
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
            {company?.status !== "NEW" ? (
              <Form.Button onClick={onCloseClick}>
                {t("company-page:edit_dialog.form.actions.cancel")}
              </Form.Button>
            ) : null}
            <Form.SubmitButton
              disabled={loading || fileSizeRestriction || contractRestriction}
            >
              {t("company-page:edit_dialog.form.actions.submit")}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export const GET_TIER_BENEFIT = gql`
  query getTierBenefit($tag: String!) {
    tierBenefitCollection(
      where: {
        contentfulMetadata: {
          tags_exists: true
          tags: { id_contains_some: [$tag] }
        }
      }
    ) {
      items {
        tier
        name
      }
    }
  }
`;
