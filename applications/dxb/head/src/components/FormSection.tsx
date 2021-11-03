import {
  HubspotProvider,
  useHubspotForm
} from "@aaronhayes/react-use-hubspot-form";
import Button, { ButtonProps } from "@bmi/button";
import Checkbox from "@bmi/checkbox";
import Form, { withFormControl } from "@bmi/form";
import { InputValue } from "@bmi/form/src/withFormControl";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import Select, { MenuItem } from "@bmi/select";
import TextField from "@bmi/text-field";
import Upload, { getFileSizeString } from "@bmi/upload";
import RadioGroup from "@bmi/radio-group";
import Typography from "@bmi/typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import InputBase from "@material-ui/core/InputBase";
import axios from "axios";
import { graphql, navigate } from "gatsby";
import React, { FormEvent, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";
// TODO: FormInputs should be updated and used here.
import { convertMarkdownLinksToAnchorLinks } from "./FormInputs";
import { Data as LinkData } from "./Link";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import styles from "./styles/FormSection.module.scss";

const InputTypes = [
  "text",
  "email",
  "phone",
  "textarea",
  "checkbox",
  "select",
  "upload"
];

type SourceType = "Contentful" | "HubSpot";

type InputType = {
  label: string;
  name: string;
  options?: string;
  required?: boolean;
  type: typeof InputTypes[number];
  width?: "full" | "half";
  accept?: string;
  maxSize?: number;
  token?: string;
};

export type Data = {
  __typename: "ContentfulFormSection";
  title: string;
  showTitle: boolean | null;
  description?: RichTextData | null;
  recipients: string;
  inputs: InputType[] | null;
  submitText: string | null;
  successRedirect: LinkData | null;
  source: SourceType | null;
  hubSpotFormGuid?: string | null;
};

const Input = ({
  label,
  name,
  options,
  type,
  required,
  accept = ".pdf, .jpg, .jpeg, .png",
  maxSize
}: Omit<InputType, "width">) => {
  const { getMicroCopy } = useSiteContext();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const mapBody = (file: File) => file;
  const mapValue = ({ name, type }, upload) => ({
    fileName: name,
    contentType: type,
    uploadFrom: {
      sys: {
        type: "Link",
        linkType: "Upload",
        id: upload.sys.id
      }
    }
  });

  const handleEmailValidation = (value: string) => {
    // Has a full stop and a `@`, and at least one character in between both.
    if (value.match(/.+@.+\..+/)) {
      return false;
    } else {
      return getMicroCopy("errors.emailInvalid");
    }
  };

  const handleFileValidation = (file: File) => {
    if (maxSize && file.size > maxSize * 1048576) {
      return getMicroCopy("errors.maxSize", {
        size: getFileSizeString(maxSize * 1048576)
      });
    }
  };

  // @TODO: create a separate hidden-input component
  const HiddenField = withFormControl((props) => (
    <InputBase {...props} type="hidden" />
  ));

  switch (type) {
    case "upload":
      return (
        <Upload
          id={name}
          name={name}
          buttonLabel={label}
          isRequired={required}
          fieldIsRequiredError={getMicroCopy("upload.fieldIsRequired")}
          uri={process.env.GATSBY_GCP_FORM_UPLOAD_ENDPOINT}
          headers={{
            "Content-Type": "application/octet-stream"
          }}
          accept={accept}
          fileValidation={handleFileValidation}
          instructions={
            `${getMicroCopy("form.upload.supportedFormats")}: ${accept}.` +
            (maxSize
              ? ` ${getMicroCopy("form.upload.maxSize")}: ${getFileSizeString(
                  maxSize * 1048576
                )}`
              : "")
          }
          mapBody={mapBody}
          mapValue={mapValue}
          onUploadRequest={async () => {
            const token = await executeRecaptcha();

            return {
              headers: {
                "X-Recaptcha-Token": token
              }
            };
          }}
          microcopyProvider={{
            "upload.instructions.drop": getMicroCopy(
              "upload.instructions.drop"
            ),
            "upload.instructions.browse": getMicroCopy(
              "upload.instructions.browse"
            )
          }}
        />
      );
    case "radio":
      return (
        <div>
          <Typography style={{ paddingBottom: "15px" }}>{label}</Typography>
          <RadioGroup name={name}>
            {options.split(/, |,/).map((option, $i) => (
              <RadioGroup.Item key={$i} value={option}>
                {option}
              </RadioGroup.Item>
            ))}
          </RadioGroup>
        </div>
      );
    case "select":
      return (
        <Select
          isRequired={required}
          fieldIsRequiredError={getMicroCopy("upload.fieldIsRequired")}
          label={label}
          name={name}
        >
          <MenuItem value="none">None</MenuItem>
          {options.split(/, |,/).map((option, $i) => {
            const [select, value] = option.split(/= |=/);
            return (
              <MenuItem key={$i} value={value ? option : select}>
                {select}
              </MenuItem>
            );
          })}
        </Select>
      );
    case "checkbox":
      return (
        <Checkbox
          name={name}
          label={convertMarkdownLinksToAnchorLinks(label)}
          isRequired={required}
          fieldIsRequiredError={getMicroCopy("upload.fieldIsRequired")}
        />
      );
    case "hubspot-text":
      return (
        <>
          <Typography>
            <span dangerouslySetInnerHTML={{ __html: label }}></span>
          </Typography>
          <HiddenField name={name} value={label} />
        </>
      );
    case "hubspot-checkbox":
      return (
        <Checkbox
          name={name}
          label={<span dangerouslySetInnerHTML={{ __html: label }}></span>}
          isRequired={required}
        />
      );
    case "hubspot-hidden":
      return <HiddenField name={name} value={label} />;
    case "textarea":
    case "text":
    default:
      return (
        <TextField
          name={name}
          isRequired={required}
          fieldIsRequiredError={getMicroCopy("upload.fieldIsRequired")}
          isTextArea={type === "textarea"}
          variant="outlined"
          label={label}
          fullWidth
          {...(type === "textarea" && { rows: 6 })}
          {...(type === "email" && {
            getValidationError: handleEmailValidation
          })}
        />
      );
  }
};

const HubspotForm = ({
  id,
  hubSpotFormGuid,
  backgroundColor,
  showTitle,
  title,
  description
}: {
  id: string;
  hubSpotFormGuid: string;
  backgroundColor: "pearl" | "white";
  showTitle: boolean;
  title: string;
  description: RichTextData;
}) => {
  const hubSpotFormID = `bmi-hubspot-form-${id || "no-id"}`;

  useHubspotForm({
    portalId: process.env.GATSBY_HUBSPOT_ID,
    formId: hubSpotFormGuid,
    target: `#${hubSpotFormID}`
  });

  return (
    <Section backgroundColor={backgroundColor}>
      {showTitle && <Section.Title>{title}</Section.Title>}
      {description && <RichText document={description} />}
      <div id={hubSpotFormID} className={styles["Form--hubSpot"]} />
    </Section>
  );
};

const FormSection = ({
  id,
  data: {
    title,
    showTitle = true,
    description,
    recipients,
    inputs,
    submitText,
    successRedirect,
    source,
    hubSpotFormGuid
  },
  backgroundColor
}: {
  id?: string;
  data: Data;
  backgroundColor: "pearl" | "white";
}) => {
  const { countryCode, getMicroCopy, node_locale } = useSiteContext();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const GTMButton = withGTM<ButtonProps>(Button, { label: "children" });

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();

    if (process.env.GATSBY_PREVIEW) {
      alert("You cannot submit a form on a preview environment.");
      return;
    }

    setIsSubmitting(true);

    // @todo: This needs to be less reliant on string patterns
    const recipientsFromValues = (values.recipients as string) || "";
    const isEmailPresent = ["@", "="].every((char) =>
      recipientsFromValues.includes(char)
    );
    const conditionalRecipients =
      recipientsFromValues && isEmailPresent
        ? recipientsFromValues.split(/= |=/)[1]
        : recipients;

    try {
      const source = axios.CancelToken.source();
      const token = await executeRecaptcha();

      await axios.post(
        process.env.GATSBY_GCP_FORM_SUBMIT_ENDPOINT,
        {
          locale: node_locale,
          title,
          recipients: conditionalRecipients,
          values
        },
        {
          cancelToken: source.token,
          headers: { "X-Recaptcha-Token": token }
        }
      );

      setIsSubmitting(false);
      if (successRedirect) {
        navigate(
          successRedirect.url ||
            getPathWithCountryCode(countryCode, successRedirect.linkedPage.path)
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      setIsSubmitting(false);
      // @todo Handle error
      console.error("Error", { error }); // eslint-disable-line
    }
  };

  const handleHubSpotSubmit = async (
    event: FormEvent<HTMLFormElement>,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();

    if (process.env.GATSBY_PREVIEW) {
      alert("You cannot submit a form on a preview environment.");
      return;
    }

    setIsSubmitting(true);

    const valuesArray = Object.entries(values).map(([name, value]) => ({
      name,
      value
    }));

    const valuesWithoutLegaConsent = valuesArray.filter(
      (field) => field.name.substring(0, 9) !== "hs-legal-"
    );

    const hsLegalFields = valuesArray
      .filter((field) => field.name.substring(0, 9) === "hs-legal-")
      .reduce((acc, cur) => {
        return { ...acc, [cur.name]: cur.value };
      }, {});

    const hsPayload = {
      fields: valuesWithoutLegaConsent,
      context: {
        pageUri: window.location.href
      }
    };

    const getLegalOptions = (hsLegalFields) => {
      if (hsLegalFields["hs-legal-isLegitimateInterest"]) {
        return {
          legitimateInterest: {
            value: true,
            subscriptionTypeId: hsLegalFields["hs-legal-communicationTypeId"],
            legalBasis: "LEAD",
            text: hsLegalFields["hs-legal-privacyPolicyText"]
          }
        };
      }
      if (hsLegalFields["hs-legal-communication"]) {
        return {
          consent: {
            consentToProcess:
              hsLegalFields["hs-legal-processingConsentType"] || true,
            text: hsLegalFields["hs-legal-processingConsentText"],
            communications: [
              {
                value: hsLegalFields["hs-legal-communication"],
                subscriptionTypeId:
                  hsLegalFields["hs-legal-communicationTypeId"],
                text: hsLegalFields["hs-legal-communicationConsentText"]
              }
            ]
          }
        };
      }
    };

    try {
      await axios.post(
        `${process.env.GATSBY_HUBSPOT_API_URL}${process.env.GATSBY_HUBSPOT_ID}/${hubSpotFormGuid}`,
        {
          ...hsPayload,
          ...(hsLegalFields
            ? {
                legalConsentOptions: getLegalOptions(hsLegalFields)
              }
            : {})
        }
      );

      setIsSubmitting(false);
      if (successRedirect) {
        navigate(
          successRedirect.url ||
            getPathWithCountryCode(countryCode, successRedirect.linkedPage.path)
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      setIsSubmitting(false);
      // @todo Handle error
      console.error("Error", { error }); // eslint-disable-line
    }
  };

  if (source === "HubSpot" && hubSpotFormGuid) {
    return (
      <HubspotProvider async={false} addToHead={true}>
        <HubspotForm
          id={id}
          hubSpotFormGuid={hubSpotFormGuid}
          backgroundColor={backgroundColor}
          showTitle={showTitle}
          title={title}
          description={description}
        />
      </HubspotProvider>
    );
  }

  return (
    <Section backgroundColor={backgroundColor}>
      {showTitle && <Section.Title>{title}</Section.Title>}
      {description && <RichText document={description} />}
      {inputs ? (
        <Form
          onSubmit={
            // TODO Handle/remove after HubSpot mapping has been decided
            source === "HubSpot" && hubSpotFormGuid
              ? handleHubSpotSubmit
              : handleSubmit
          }
          className={styles["Form"]}
          rightAlignButton
        >
          <Grid container spacing={3}>
            {inputs.map(({ width, ...props }, $i) => (
              <Grid key={$i} item xs={12} md={width === "full" ? 12 : 6}>
                <Input {...props} />
              </Grid>
            ))}
          </Grid>
          <Form.ButtonWrapper>
            <Form.SubmitButton
              component={(props: ButtonProps) => (
                <GTMButton
                  gtm={{
                    id: "form-button1",
                    action: title
                  }}
                  {...props}
                />
              )}
              endIcon={
                isSubmitting ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                    style={{ marginLeft: "0.5rem" }}
                  />
                ) : (
                  <ArrowForwardIcon />
                )
              }
              disabled={isSubmitting}
            >
              {submitText || getMicroCopy("form.submit")}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      ) : (
        "Form contains no fields"
      )}

      <RecaptchaPrivacyLinks />
    </Section>
  );
};

export default FormSection;

export const query = graphql`
  fragment FormSectionFragment on ContentfulFormSection {
    __typename
    title
    showTitle
    description {
      ...RichTextFragment
    }
    recipients
    inputs {
      label
      name
      options
      type
      required
      width
      accept
      maxSize
    }
    submitText
    successRedirect {
      ...LinkFragment
    }
    source
    hubSpotFormGuid
  }
  fragment FormSectionFragmentNonRecursive on ContentfulFormSection {
    __typename
    title
    showTitle
    description {
      ...RichTextFragmentNonRecursive
    }
    recipients
    inputs {
      label
      name
      options
      type
      required
      width
      accept
      maxSize
    }
    submitText
    successRedirect {
      ...LinkFragmentNonRecursive
    }
    source
    hubSpotFormGuid
  }
`;
