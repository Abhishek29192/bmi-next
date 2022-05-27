import {
  HubspotProvider,
  useHubspotForm
} from "@aaronhayes/react-use-hubspot-form";
import {
  AnchorLink,
  Button,
  ButtonProps,
  Checkbox,
  Form,
  getFileSizeString,
  Grid,
  InputValue,
  RadioGroup,
  Section,
  Select,
  SelectMenuItem,
  TextField,
  Typography,
  Upload
} from "@bmi/components";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";
import { graphql, navigate } from "gatsby";
import React, { FormEvent, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import matchAll from "string.prototype.matchall";
import { getPathWithCountryCode } from "../utils/path";
import { useConfig } from "../contexts/ConfigProvider";
import withGTM, { GTM } from "../utils/google-tag-manager";
import { isValidEmail } from "../utils/emailUtils";
import { microCopy } from "../constants/microCopies";
import HiddenInput from "./HiddenInput";
import styles from "./styles/FormSection.module.scss";
import { useSiteContext } from "./Site";
import RichText, { RichTextData } from "./RichText";
import { Data as LinkData, isExternalUrl } from "./Link";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";
import ControlledCheckboxGroup from "./CheckboxGroup";

type SourceType = "Contentful" | "HubSpot";

export type Data = {
  __typename: "ContentfulFormSection";
  title: string;
  showTitle: boolean | null;
  description?: RichTextData | null;
  recipients: string;
  inputs: InputType[] | null;
  submitText: string | null;
  successRedirect: LinkData | null;
  source: SourceType;
  hubSpotFormGuid?: string | null;
  sample_ids?: string | null;
  emailSubjectFormat?: string;
};

const InputTypes = [
  "text",
  "email",
  "phone",
  "textarea",
  "checkbox",
  "select",
  "upload"
];

export type InputWidthType = "full" | "half";

export type InputType = {
  label: string;
  name: string;
  options?: string;
  required?: boolean;
  type: typeof InputTypes[number];
  width?: InputWidthType;
  accept?: string;
  maxSize?: number;
  token?: string;
};

export const convertMarkdownLinksToAnchorLinks = (
  source?: string
): React.ReactNode => {
  if (!source) {
    return;
  }

  const matches = [...matchAll(source, /\[([^\]]+)\]\(([^)]+)\)/g)];

  if (!matches || !matches.length) {
    return source;
  }

  return matches.filter(Boolean).map((el) => {
    const [match, label, link] = el;
    const { index: offset, input } = el;
    return (
      <>
        {input.substring(0, offset)}
        <AnchorLink
          action={{ model: "htmlLink", href: link }}
          target="_blank"
          rel={isExternalUrl(link) && "noopener"}
        >
          {label}
        </AnchorLink>
        {input.substring(offset + match.length)}
      </>
    );
  });
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
  const {
    config: { gcpFormUploadEndpoint }
  } = useConfig();
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
      return getMicroCopy(microCopy.ERRORS_EMAIL_INVALID);
    }
  };

  const handleFileValidation = (file: File) => {
    if (maxSize && file.size > maxSize * 1048576) {
      return getMicroCopy(microCopy.ERRORS_MAX_SIZE, {
        size: getFileSizeString(maxSize * 1048576)
      });
    }
  };

  switch (type) {
    case "upload":
      return (
        <Upload
          id={name}
          name={name}
          buttonLabel={label}
          isRequired={required}
          fieldIsRequiredError={getMicroCopy(
            microCopy.UPLOAD_FIELD_IS_REQUIRED
          )}
          uri={gcpFormUploadEndpoint}
          headers={{
            "Content-Type": "application/octet-stream"
          }}
          accept={accept}
          fileValidation={handleFileValidation}
          instructions={
            `${getMicroCopy(
              microCopy.FORM_UPLOAD_SUPPORTED_FORMATS
            )}: ${accept}.` +
            (maxSize
              ? ` ${getMicroCopy(
                  microCopy.FORM_UPLOAD_MAX_SIZE
                )}: ${getFileSizeString(maxSize * 1048576)}`
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
              microCopy.UPLOAD_INSTRUCTIONS_DROP
            ),
            "upload.instructions.browse": getMicroCopy(
              microCopy.UPLOAD_INSTRUCTIONS_BROWSE
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
          fieldIsRequiredError={getMicroCopy(
            microCopy.UPLOAD_FIELD_IS_REQUIRED
          )}
          label={label}
          name={name}
        >
          <SelectMenuItem value={microCopy.FORM_NONE_SELECTION}>
            {getMicroCopy(microCopy.FORM_NONE_SELECTION)}
          </SelectMenuItem>
          {options.split(/, |,/).map((option, $i) => {
            const [select, value] = option.split(/= |=/);
            return (
              <SelectMenuItem key={$i} value={value ? option : select}>
                {select}
              </SelectMenuItem>
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
          fieldIsRequiredError={getMicroCopy(
            microCopy.UPLOAD_FIELD_IS_REQUIRED
          )}
        />
      );
    case "checkboxGroup":
      return (
        <ControlledCheckboxGroup
          name={name}
          options={options}
          groupName={convertMarkdownLinksToAnchorLinks(label)}
          isRequired={required}
          fieldIsRequiredError={getMicroCopy(
            microCopy.UPLOAD_FIELD_IS_REQUIRED
          )}
        />
      );
    case "hubspot-text":
      return (
        <>
          <Typography>
            <span dangerouslySetInnerHTML={{ __html: label }}></span>
          </Typography>
          <HiddenInput name={name} value={label} />
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
      return <HiddenInput name={name} value={label} />;
    case "textarea":
    case "text":
    default:
      return (
        <TextField
          name={name}
          isRequired={required}
          errorText={getMicroCopy(microCopy.UPLOAD_FIELD_IS_REQUIRED)}
          fieldIsRequiredError={getMicroCopy(
            microCopy.UPLOAD_FIELD_IS_REQUIRED
          )}
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

type FormInputs = {
  inputs: InputType[];
};

export const FormInputs = ({ inputs }: FormInputs) => {
  return (
    <>
      {inputs.map(({ width, ...props }, $i) => (
        <Grid key={$i} item xs={12} md={width === "full" ? 12 : 6}>
          <Input {...props} />
        </Grid>
      ))}
    </>
  );
};

const HubspotForm = ({
  id,
  hubSpotFormGuid,
  backgroundColor,
  showTitle,
  title,
  description,
  onSuccess,
  additionalValues
}: {
  id: string;
  hubSpotFormGuid: string;
  backgroundColor: "pearl" | "white";
  showTitle: boolean;
  title: string;
  description: RichTextData;
  onSuccess: FormSectionProps["onSuccess"];
  additionalValues: FormSectionProps["additionalValues"];
}) => {
  const hubSpotFormID = `bmi-hubspot-form-${id || "no-id"}`;
  const {
    config: { hubSpotId }
  } = useConfig();

  // Uses the HS script to bring in the form. This will create an iframe regardless
  // of styling options, but will only _use_ the iframe if it's _not_ raw HTML (empty
  // iframe otherwise).
  useHubspotForm({
    portalId: hubSpotId || "",
    formId: hubSpotFormGuid,
    target: `#${hubSpotFormID}`
  });

  typeof window !== "undefined" &&
    window.addEventListener("message", (event: MessageEvent) => {
      if (
        event.data.type === "hsFormCallback" &&
        event.data.eventName === "onFormReady"
      ) {
        if (additionalValues["samples"]) {
          const sampleIdsInput = document.querySelector<HTMLInputElement>(
            'input[name="sample_ids"]'
          );

          if (sampleIdsInput) {
            sampleIdsInput.value = additionalValues["samples"];
          } else {
            const iframeElement = document.querySelector<HTMLIFrameElement>(
              `#${hubSpotFormID} iframe`
            );
            const hiddenInput =
              iframeElement.contentWindow?.document.querySelector<HTMLInputElement>(
                'input[name="sample_ids"]'
              );
            hiddenInput && (hiddenInput.value = additionalValues["samples"]);
          }
        }
      }

      if (event.data.eventName === "onFormSubmitted") {
        onSuccess && onSuccess();
      }
    });

  return (
    <Section backgroundColor={backgroundColor}>
      {showTitle && <Section.Title>{title}</Section.Title>}
      {description && <RichText document={description} />}
      <div id={hubSpotFormID} className={styles["Form--hubSpot"]} />
    </Section>
  );
};

type FormSectionProps = {
  id?: string;
  data: Data;
  backgroundColor: "pearl" | "white";
  additionalValues?: Record<string, string>;
  sampleIds?: string;
  isSubmitDisabled?: boolean;
  gtmOverride?: Partial<GTM>;
  onSuccess?: () => void;
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
    hubSpotFormGuid,
    emailSubjectFormat
  },
  backgroundColor,
  additionalValues,
  isSubmitDisabled,
  gtmOverride,
  onSuccess
}: FormSectionProps) => {
  const {
    config: { isPreviewMode, gcpFormSubmitEndpoint, hubspotApiUrl, hubSpotId }
  } = useConfig();
  const { countryCode, getMicroCopy, node_locale } = useSiteContext();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const GTMButton = withGTM<ButtonProps>(Button, {
    label: "aria-label",
    action: "aria-action"
  });

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();

    if (isPreviewMode) {
      alert("You cannot submit a form on a preview environment.");
      return;
    }

    setIsSubmitting(true);

    Object.assign(values, additionalValues);
    const recipientsFromValues = (values.recipients as string) || "";
    const isEmailPresent = ["@", "="].every((char) =>
      recipientsFromValues.includes(char)
    );
    const recipientEmail = recipientsFromValues.split(/= |=/)[1];
    if (!isValidEmail(recipientEmail)) {
      console.error("Error", "invalid e-mail recipient address"); // eslint-disable-line
    }
    const conditionalRecipients =
      recipientsFromValues && isEmailPresent ? recipientEmail : recipients;

    try {
      const source = axios.CancelToken.source();
      const token = await executeRecaptcha();

      await axios.post(
        gcpFormSubmitEndpoint,
        {
          locale: node_locale,
          title,
          recipients: conditionalRecipients,
          values,
          emailSubjectFormat
        },
        {
          cancelToken: source.token,
          headers: { "X-Recaptcha-Token": token }
        }
      );

      setIsSubmitting(false);
      onSuccess && onSuccess();
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

  //This function right now is not used. Left here only for future extend of Hubspot usage
  const handleHubSpotSubmit = async (
    event: FormEvent<HTMLFormElement>,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();

    if (isPreviewMode) {
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
      await axios.post(`${hubspotApiUrl}${hubSpotId}/${hubSpotFormGuid}`, {
        ...hsPayload,
        ...(hsLegalFields
          ? {
              legalConsentOptions: getLegalOptions(hsLegalFields)
            }
          : {})
      });

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
          onSuccess={onSuccess}
          additionalValues={additionalValues}
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
            <FormInputs inputs={inputs} />
          </Grid>
          <Form.ButtonWrapper>
            <Form.SubmitButton
              component={(props: ButtonProps) => {
                return (
                  <GTMButton
                    {...props}
                    gtm={{
                      id: "form-button1"
                    }}
                    aria-label={
                      gtmOverride?.label ? gtmOverride?.label : "children"
                    }
                    aria-action={
                      gtmOverride?.action ? gtmOverride?.action : title
                    }
                  />
                );
              }}
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
              disabled={isSubmitting || isSubmitDisabled}
            >
              {submitText || getMicroCopy(microCopy.FORM_SUBMIT)}
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
FormSection.Inputs = FormInputs;
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
      ...FormInputsFragment
    }
    submitText
    successRedirect {
      ...LinkFragment
    }
    source
    hubSpotFormGuid
    emailSubjectFormat
  }
  fragment FormInputsFragment on ContentfulFormInputs {
    label
    name
    options
    type
    required
    width
    accept
    maxSize
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
      ...FormInputsFragment
    }
    submitText
    successRedirect {
      ...LinkFragmentNonRecursive
    }
    source
    hubSpotFormGuid
  }
`;
