import Checkbox from "@bmi-digital/components/checkbox";
import Form, { FormContext } from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import isEqual from "lodash-es/isEqual";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { convertMarkdownLinksToAnchorLinks } from "../../../components/FormSection";
import { useSiteContext } from "../../../components/Site";
import { handleEmailValidation } from "../../../utils/emailUtils";
import { getDefaultFormValues } from "../helpers/getDefaultFormValues";
import { FormStatus, TrainingRegistrationPageData } from "../types";
import ExtraParticipants from "./ExtraParticipants";
import CustomTextField from "./TextField";
import {
  CompetentChamberLabel,
  OtherOptionField,
  StyledFormFieldsSection,
  StyledProgressIndicator,
  StyledRadioGroup,
  StyledSubmitButtonWrapper,
  StyledTextArea
} from "./TrainingRegistrationFormStyles";

const FormFields = (props: {
  isSubmitting: boolean;
  formData: TrainingRegistrationPageData;
  setFormStatus: (formStatus: FormStatus) => void;
}) => {
  const { getMicroCopy } = useSiteContext();
  const defaultFormValues = useMemo(
    () => getDefaultFormValues(props.formData),
    [props.formData]
  );
  const { values } = useContext(FormContext);

  useEffect(() => {
    if (!Object.keys(values).length) {
      return;
    }

    const formStatus = isEqual(defaultFormValues, values)
      ? FormStatus.Initialized
      : FormStatus.Edited;
    props.setFormStatus(formStatus);
  }, [values, defaultFormValues, props]);

  const discoverySourceOptions = [
    { label: props.formData.discoverySourceBrochure },
    { label: props.formData.discoverySourceFieldService },
    { label: props.formData.discoverySourceWebsite },
    { label: props.formData.discoverySourceFacebook },
    { label: props.formData.discoverySourceInstagram },
    { label: props.formData.discoverySourceXing },
    { label: props.formData.discoverySourceLinkedin },
    {
      label: props.formData.discoverySourceOther,
      withTextField: true,
      textFieldLabel: props.formData.discoverySourceSpecifyOther
    }
  ];

  const validateEmail = useCallback(
    (value: string | undefined) =>
      handleEmailValidation(
        getMicroCopy(microCopy.ERRORS_EMAIL_INVALID),
        value
      ),
    [getMicroCopy]
  );

  return (
    <>
      <StyledFormFieldsSection container spacing={3}>
        <Grid xs={12}>
          <StyledRadioGroup
            title={props.formData.salutationTitle}
            name={props.formData.salutationTitle}
            defaultValue={defaultFormValues[props.formData.salutationTitle]}
            options={[
              { label: props.formData.salutationMale },
              { label: props.formData.salutationFemale }
            ]}
          />
        </Grid>
      </StyledFormFieldsSection>
      <StyledFormFieldsSection container spacing={3}>
        <Grid xs={12} mt={1}>
          <CustomTextField
            id={replaceSpaces(props.formData.title)}
            name={props.formData.title}
            isRequired={false}
            variant="outlined"
            label={props.formData.title}
            fullWidth
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.firstName)}
            name={props.formData.firstName}
            isRequired
            variant="outlined"
            label={props.formData.firstName}
            errorText={getMicroCopy(microCopy.VALIDATION_ERRORS_FIELD_REQUIRED)}
            fieldIsRequiredError={getMicroCopy(
              microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
            )}
            fullWidth
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.lastName)}
            name={props.formData.lastName}
            isRequired
            variant="outlined"
            label={props.formData.lastName}
            errorText={getMicroCopy(microCopy.VALIDATION_ERRORS_FIELD_REQUIRED)}
            fieldIsRequiredError={getMicroCopy(
              microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
            )}
            fullWidth
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.email)}
            type="email"
            name={props.formData.email}
            isRequired
            variant="outlined"
            label={props.formData.email}
            errorText={getMicroCopy(microCopy.VALIDATION_ERRORS_FIELD_REQUIRED)}
            fieldIsRequiredError={getMicroCopy(
              microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
            )}
            fullWidth
            getValidationError={validateEmail}
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.companyName)}
            name={props.formData.companyName}
            isRequired={false}
            variant="outlined"
            label={props.formData.companyName}
            fullWidth
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.position)}
            name={props.formData.position}
            isRequired
            variant="outlined"
            label={props.formData.position}
            errorText={getMicroCopy(microCopy.VALIDATION_ERRORS_FIELD_REQUIRED)}
            fieldIsRequiredError={getMicroCopy(
              microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
            )}
            fullWidth
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.customerNumber)}
            name={props.formData.customerNumber}
            isRequired={false}
            variant="outlined"
            label={props.formData.customerNumber}
            fullWidth
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.street)}
            name={props.formData.street}
            isRequired
            variant="outlined"
            label={props.formData.street}
            errorText={getMicroCopy(microCopy.VALIDATION_ERRORS_FIELD_REQUIRED)}
            fieldIsRequiredError={getMicroCopy(
              microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
            )}
            fullWidth
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.postalCode)}
            name={props.formData.postalCode}
            isRequired
            variant="outlined"
            label={props.formData.postalCode}
            errorText={getMicroCopy(microCopy.VALIDATION_ERRORS_FIELD_REQUIRED)}
            fieldIsRequiredError={getMicroCopy(
              microCopy.VALIDATION_ERRORS_FIELD_REQUIRED
            )}
            fullWidth
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.city)}
            name={props.formData.city}
            variant="outlined"
            label={props.formData.city}
            fullWidth
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <CustomTextField
            id={replaceSpaces(props.formData.phoneNumber)}
            name={props.formData.phoneNumber}
            variant="outlined"
            label={props.formData.phoneNumber}
            fullWidth
          />
        </Grid>
      </StyledFormFieldsSection>
      <StyledFormFieldsSection container spacing={3}>
        <Grid xs={12}>
          <CompetentChamberLabel
            htmlFor={replaceSpaces(props.formData.competentChamber)}
          >
            {props.formData.competentChamberLabel.competentChamberLabel}
          </CompetentChamberLabel>
          <CustomTextField
            id={replaceSpaces(props.formData.competentChamber)}
            name={props.formData.competentChamber}
            variant="outlined"
            label={props.formData.competentChamber}
            fullWidth
          />
        </Grid>
      </StyledFormFieldsSection>
      <StyledFormFieldsSection container spacing={3}>
        <Grid xs={12}>
          <StyledRadioGroup
            name={props.formData.bmiSystemPartnerClubTitle}
            defaultValue={
              defaultFormValues[props.formData.bmiSystemPartnerClubTitle]
            }
            title={convertMarkdownLinksToAnchorLinks(
              props.formData.bmiSystemPartnerClubTitle
            )}
            options={[
              { label: props.formData.isMemberOfBmiLabel },
              { label: props.formData.isNotMemberOfBmiLabel }
            ]}
          />
        </Grid>
      </StyledFormFieldsSection>
      <StyledFormFieldsSection container spacing={3}>
        <Grid xs={12}>
          <StyledRadioGroup
            name={props.formData.discoverySourceTitle}
            title={props.formData.discoverySourceTitle}
            defaultValue={
              defaultFormValues[props.formData.discoverySourceTitle]
            }
            textFieldComponent={OtherOptionField}
            options={discoverySourceOptions}
          />
        </Grid>
      </StyledFormFieldsSection>
      <StyledFormFieldsSection container spacing={3}>
        <Grid xs={12}>
          <StyledTextArea
            id={replaceSpaces(props.formData.comment)}
            name={props.formData.comment}
            variant="outlined"
            label={props.formData.comment}
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
            title={props.formData.extraParticipantTitle}
            removeButtonLabel={props.formData.removeParticipantButton}
            addParticipantButtonLabel={props.formData.addParticipantsButton}
            subtitle={props.formData.extraParticipantSubtitle}
            participantTitle={props.formData.newParticipantTitle}
            firstNameLabel={props.formData.newParticipantFirstName}
            lastNameLabel={props.formData.newParticipantLastName}
          />
        </Grid>
      </StyledFormFieldsSection>
      <StyledFormFieldsSection container spacing={3} rowSpacing="12px" pt="6px">
        <Grid xs={12}>
          <Checkbox
            data-testid="consent-text-checkbox"
            name="consent"
            label={convertMarkdownLinksToAnchorLinks(
              props.formData.consentText.consentText
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
              props.formData.termsOfUse.termsOfUse
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
            !props.isSubmitting
              ? getMicroCopy(microCopy.FORM_SUBMIT_BUTTON_HELP_TEXT)
              : undefined
          }
          disabled={props.isSubmitting}
          endIcon={
            props.isSubmitting && (
              <StyledProgressIndicator size={24} color="inherit" />
            )
          }
        >
          {props.formData.registerButton}
        </Form.SubmitButton>
      </StyledSubmitButtonWrapper>
    </>
  );
};

export default FormFields;
