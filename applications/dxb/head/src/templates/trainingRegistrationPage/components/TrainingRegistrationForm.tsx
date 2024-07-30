import Form, { InputValue } from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import Section from "@bmi-digital/components/section";
import logger from "@bmi-digital/functions-logger";
import { Training } from "@bmi/elasticsearch-types";
import { microCopy } from "@bmi/microcopies";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { useSiteContext } from "../../../components/Site";
import { QA_AUTH_TOKEN } from "../../../constants/cookieConstants";
import { useConfig } from "../../../contexts/ConfigProvider";
import getCookie from "../../../utils/getCookie";
import { FormStatus, TrainingRegistrationPageData } from "../types";
import FormFields from "./FormFields";
import { StyledRecaptchaText } from "./TrainingRegistrationFormStyles";

type TrainingRegistrationFormProps = {
  formData: TrainingRegistrationPageData;
  setFormStatus: (formStatus: FormStatus) => void;
  trainingDetailsPageUrl: string;
  courseCode?: string;
  training?: Training;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
};

const TrainingRegistrationForm = (props: TrainingRegistrationFormProps) => {
  const { getMicroCopy, node_locale } = useSiteContext();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);
  const { gcpFormSubmitEndpoint } = useConfig();
  const router = useRouter();

  const discoverySourceOtherFieldName = useMemo(
    () => `${replaceSpaces(props.formData.discoverySourceOther)}-textfield`,
    [props.formData.discoverySourceOther]
  );

  const handleFormSubmit = async (
    event: React.FormEvent,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();

    props.setIsSubmitting(true);

    try {
      const token = qaAuthToken ? undefined : await executeRecaptcha?.();

      // valuesToSend is of type Record<string, NonNullable<InputValue>> but causes issues later on
      const valuesToSend = Object.entries(values).reduce(
        (acc, [key, value]) => {
          return value ? ((acc[`${key}`] = value), acc) : acc;
        },
        {}
      );
      const sanitizedValues: Record<string, string> = {};
      const checkmark = String.fromCodePoint(0x2713);

      sanitizedValues[getMicroCopy(microCopy.TRAINING_EMAIL_LABEL)] =
        `${props.training?.courseCode} - ${props.training?.courseName}, ${props.training?.sessionName}`;

      sanitizedValues[getMicroCopy(microCopy.TRAINING_EMAIL_START_DATE)] =
        new Date(props.training!.startDate).toLocaleString(node_locale);

      const discoverySourceValue = values[props.formData.discoverySourceTitle];
      const isOtherDiscoverySourceSelected =
        discoverySourceValue === props.formData.discoverySourceOther;

      sanitizedValues[
        getMicroCopy(microCopy.TRAINING_EMAIL_TERM_OF_USE_LABEL)
      ] = checkmark;

      sanitizedValues[
        getMicroCopy(microCopy.TRAINING_EMAIL_DATA_CONSENT_LABEL)
      ] = checkmark;

      for (const key of Object.keys(valuesToSend)) {
        if (key === "consent") {
          continue;
        }

        if (key === "terms-of-use") {
          continue;
        }

        if (key === discoverySourceOtherFieldName) {
          continue;
        }

        if (
          isOtherDiscoverySourceSelected &&
          key === props.formData.discoverySourceTitle
        ) {
          // eslint-disable-next-line security/detect-object-injection
          sanitizedValues[key] =
            // eslint-disable-next-line security/detect-object-injection
            valuesToSend[discoverySourceOtherFieldName]?.trim() ||
            props.formData.discoverySourceOther;
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
        recipients: props.formData.recipient,
        values: sanitizedValues,
        emailSubjectFormat: `${props.formData.emailSubject} ${props.courseCode}`
      });

      const response = await fetch(gcpFormSubmitEndpoint, {
        method: "POST",
        body,
        headers
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      router.replace(`${props.trainingDetailsPageUrl}?showDialog=true`);
    } catch (error) {
      logger.error({ message: (error as Error).message });
      props.setIsSubmitting(false);
    }
  };

  return (
    <Section
      backgroundColor="white"
      data-testid="training-registration-form-section"
    >
      <Form onSubmit={handleFormSubmit} rightAlignButton>
        <Grid container>
          <Grid xs={12} lg={8}>
            <FormFields
              isSubmitting={props.isSubmitting}
              formData={props.formData}
              setFormStatus={props.setFormStatus}
            />
            <StyledRecaptchaText testId="training-registration-page-recaptcha" />
          </Grid>
        </Grid>
      </Form>
    </Section>
  );
};

export default TrainingRegistrationForm;
