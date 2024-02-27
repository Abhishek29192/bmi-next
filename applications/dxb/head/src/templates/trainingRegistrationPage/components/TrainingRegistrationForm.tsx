import Checkbox from "@bmi-digital/components/checkbox";
import Form, { InputValue } from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import logger from "@bmi-digital/functions-logger";
import { Training } from "@bmi/elasticsearch-types";
import { microCopy } from "@bmi/microcopies";
import { navigate } from "gatsby";
import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { convertMarkdownLinksToAnchorLinks } from "../../../components/FormSection";
import { useSiteContext } from "../../../components/Site";
import { QA_AUTH_TOKEN } from "../../../constants/cookieConstants";
import { useConfig } from "../../../contexts/ConfigProvider";
import { handleEmailValidation } from "../../../utils/emailUtils";
import getCookie from "../../../utils/getCookie";
import ExtraParticipants from "./ExtraParticipants";
import CustomTextField from "./TextField";
import {
  CompetentChamberLabel,
  OtherOptionField,
  StyledFormFieldsSection,
  StyledProgressIndicator,
  StyledRadioGroup,
  StyledRecaptchaText,
  StyledSubmitButtonWrapper,
  StyledTextArea
} from "./TrainingRegistrationFormStyles";
import type { TrainingRegistrationPageData } from "../types";

const TrainingRegistrationForm = (
  props: TrainingRegistrationPageData & {
    trainingDetailsPageUrl: string;
    courseCode?: string;
    training?: Training;
  }
) => {
  const { getMicroCopy, node_locale } = useSiteContext();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);
  const { gcpFormSubmitEndpoint } = useConfig();

  const handleFormSubmit = async (
    event: React.FormEvent,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const token = qaAuthToken ? undefined : await executeRecaptcha?.();

      const valuesToSend = Object.entries(values).reduce(
        (acc, [key, value]) => {
          return value ? ((acc[`${key}`] = value), acc) : acc;
        },
        {}
      );
      const sanitizedValues = {};

      sanitizedValues[getMicroCopy(microCopy.TRAINING_EMAIL_LABEL)] =
        `${props.training?.courseCode} - ${props.training?.courseName}, ${props.training?.sessionName}`;

      sanitizedValues[getMicroCopy(microCopy.TRAINING_EMAIL_START_DATE)] =
        props.training?.startDate &&
        new Date(props.training.startDate).toLocaleString(node_locale);

      sanitizedValues[
        getMicroCopy(microCopy.TRAINING_EMAIL_TERM_OF_USE_LABEL)
      ] = props.termsOfUse.termsOfUse;

      sanitizedValues[
        getMicroCopy(microCopy.TRAINING_EMAIL_DATA_CONSENT_LABEL)
      ] = props.consentText.consentText;

      for (const key of Object.keys(valuesToSend)) {
        if (key === "consent") {
          continue;
        }
        if (key === "terms-of-use") {
          continue;
        }

        // eslint-disable-next-line security/detect-object-injection
        const trimmedValue = valuesToSend[key].trim();
        if (trimmedValue !== "") {
          // eslint-disable-next-line security/detect-object-injection
          sanitizedValues[key] = trimmedValue;
        }
      }

      let headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-Recaptcha-Token": token
      };
      if (qaAuthToken) {
        headers = { ...headers, authorization: `Bearer ${qaAuthToken}` };
      }

      const body = JSON.stringify({
        locale: node_locale,
        title: "",
        recipients: props.recipient,
        values: sanitizedValues,
        emailSubjectFormat: `${props.emailSubject} ${props?.courseCode}`
      });

      const response = await fetch(gcpFormSubmitEndpoint, {
        method: "POST",
        body,
        headers
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      logger.error({ message: (error as Error).message });
    }

    setIsSubmitting(false);
    navigate(props.trainingDetailsPageUrl, {
      state: { showResultsModal: true },
      replace: true
    });
  };

  const discoverySourceOptions = [
    { label: props.discoverySourceBrochure },
    { label: props.discoverySourceFieldService },
    { label: props.discoverySourceWebsite },
    { label: props.discoverySourceFacebook },
    { label: props.discoverySourceInstagram },
    { label: props.discoverySourceXing },
    { label: props.discoverySourceLinkedin },
    {
      label: props.discoverySourceOther,
      withTextField: true,
      textFieldLabel: props.discoverySourceSpecifyOther
    }
  ];

  return (
    <Section
      backgroundColor="white"
      data-testid="training-registration-form-section"
    >
      <Form onSubmit={handleFormSubmit} rightAlignButton>
        <Grid container>
          <Grid xs={12} lg={8}>
            <StyledFormFieldsSection container spacing={3}>
              <Grid xs={12}>
                <StyledRadioGroup
                  title={props.salutationTitle}
                  name={props.salutationTitle}
                  defaultValue={props.salutationMale}
                  options={[
                    { label: props.salutationMale },
                    { label: props.salutationFemale }
                  ]}
                />
              </Grid>
            </StyledFormFieldsSection>
            <StyledFormFieldsSection container spacing={3}>
              <Grid xs={12} mt={1}>
                <CustomTextField
                  id={replaceSpaces(props.title)}
                  name={props.title}
                  isRequired={false}
                  variant="outlined"
                  label={props.title}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.firstName)}
                  name={props.firstName}
                  isRequired
                  variant="outlined"
                  label={props.firstName}
                  errorText={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fieldIsRequiredError={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.lastName)}
                  name={props.lastName}
                  isRequired
                  variant="outlined"
                  label={props.lastName}
                  errorText={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fieldIsRequiredError={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.email)}
                  type="email"
                  name={props.email}
                  isRequired
                  variant="outlined"
                  label={props.email}
                  errorText={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fieldIsRequiredError={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fullWidth
                  getValidationError={(value) =>
                    handleEmailValidation(
                      getMicroCopy(microCopy.ERRORS_EMAIL_INVALID),
                      value
                    )
                  }
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.companyName)}
                  name={props.companyName}
                  isRequired={false}
                  variant="outlined"
                  label={props.companyName}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.position)}
                  name={props.position}
                  isRequired
                  variant="outlined"
                  label={props.position}
                  errorText={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fieldIsRequiredError={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.customerNumber)}
                  name={props.customerNumber}
                  isRequired={false}
                  variant="outlined"
                  label={props.customerNumber}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.street)}
                  name={props.street}
                  isRequired
                  variant="outlined"
                  label={props.street}
                  errorText={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fieldIsRequiredError={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.postalCode)}
                  name={props.postalCode}
                  isRequired
                  variant="outlined"
                  label={props.postalCode}
                  errorText={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fieldIsRequiredError={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.city)}
                  name={props.city}
                  variant="outlined"
                  label={props.city}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} lg={6}>
                <CustomTextField
                  id={replaceSpaces(props.phoneNumber)}
                  name={props.phoneNumber}
                  variant="outlined"
                  label={props.phoneNumber}
                  fullWidth
                />
              </Grid>
            </StyledFormFieldsSection>
            <StyledFormFieldsSection container spacing={3}>
              <Grid xs={12}>
                <CompetentChamberLabel
                  htmlFor={replaceSpaces(props.competentChamber)}
                >
                  {props.competentChamberLabel.competentChamberLabel}
                </CompetentChamberLabel>
                <CustomTextField
                  id={replaceSpaces(props.competentChamber)}
                  name={props.competentChamber}
                  variant="outlined"
                  label={props.competentChamber}
                  fullWidth
                />
              </Grid>
            </StyledFormFieldsSection>
            <StyledFormFieldsSection container spacing={3}>
              <Grid xs={12}>
                <StyledRadioGroup
                  name={props.bmiSystemPartnerClubTitle}
                  defaultValue={props.isMemberOfBmiLabel}
                  title={convertMarkdownLinksToAnchorLinks(
                    props.bmiSystemPartnerClubTitle
                  )}
                  options={[
                    { label: props.isMemberOfBmiLabel },
                    { label: props.isNotMemberOfBmiLabel }
                  ]}
                />
              </Grid>
            </StyledFormFieldsSection>
            <StyledFormFieldsSection container spacing={3}>
              <Grid xs={12}>
                <StyledRadioGroup
                  name={props.discoverySourceTitle}
                  title={props.discoverySourceTitle}
                  defaultValue={props.discoverySourceBrochure}
                  textFieldComponent={OtherOptionField}
                  options={discoverySourceOptions}
                />
              </Grid>
            </StyledFormFieldsSection>
            <StyledFormFieldsSection container spacing={3}>
              <Grid xs={12}>
                <StyledTextArea
                  id={replaceSpaces(props.comment)}
                  name={props.comment}
                  variant="outlined"
                  label={props.comment}
                  type="textarea"
                  rows={6}
                  isTextArea
                  fullWidth
                />
              </Grid>
            </StyledFormFieldsSection>
            <StyledFormFieldsSection container spacing={3}>
              <Grid xs={12}>
                <ExtraParticipants
                  title={props.extraParticipantTitle}
                  removeButtonLabel={props.removeParticipantButton}
                  addParticipantButtonLabel={props.addParticipantsButton}
                  subtitle={props.extraParticipantSubtitle}
                  participantTitle={props.newParticipantTitle}
                  firstNameLabel={props.newParticipantFirstName}
                  lastNameLabel={props.newParticipantLastName}
                />
              </Grid>
            </StyledFormFieldsSection>
            <StyledFormFieldsSection
              container
              spacing={3}
              rowSpacing="12px"
              pt="6px"
            >
              <Grid xs={12}>
                <Checkbox
                  data-testid="consent-text-checkbox"
                  name="consent"
                  label={convertMarkdownLinksToAnchorLinks(
                    props.consentText.consentText
                  )}
                  isRequired
                  fieldIsRequiredError={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                />
              </Grid>
              <Grid xs={12}>
                <Checkbox
                  name="terms-of-use"
                  data-testid="terms-of-use-checkbox"
                  label={convertMarkdownLinksToAnchorLinks(
                    props.termsOfUse.termsOfUse
                  )}
                  isRequired
                  fieldIsRequiredError={getMicroCopy(
                    microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
                  )}
                />
              </Grid>
            </StyledFormFieldsSection>
            <StyledSubmitButtonWrapper>
              <Form.SubmitButton
                size="large"
                data-testid="register-button"
                disabledButtonHelpText={
                  !isSubmitting
                    ? getMicroCopy(microCopy.FORM_SUBMIT_BUTTON_HELP_TEXT)
                    : undefined
                }
                disabled={isSubmitting}
                endIcon={
                  isSubmitting && (
                    <StyledProgressIndicator size={24} color="inherit" />
                  )
                }
              >
                {props.registerButton}
              </Form.SubmitButton>
            </StyledSubmitButtonWrapper>
            <StyledRecaptchaText testId="training-registration-page-recaptcha" />
          </Grid>
        </Grid>
      </Form>
    </Section>
  );
};

export default TrainingRegistrationForm;
