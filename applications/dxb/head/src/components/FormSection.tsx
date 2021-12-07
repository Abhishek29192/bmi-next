import {
  HubspotProvider,
  useHubspotForm
} from "@aaronhayes/react-use-hubspot-form";
import Button, { ButtonProps } from "@bmi/button";
import Form from "@bmi/form";
import { InputValue } from "@bmi/form/src/withFormControl";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";
import { graphql, navigate } from "gatsby";
import React, { FormEvent, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import matchAll from "string.prototype.matchall";
import AnchorLink from "@bmi/anchor-link";
import { getFileSizeString } from "@bmi/upload";
import Upload from "@bmi/upload";
import Typography from "@bmi/typography";
import RadioGroup from "@bmi/radio-group";
import Select, { MenuItem } from "@bmi/select";
import Checkbox from "@bmi/checkbox";
import TextField from "@bmi/text-field";
import { getPathWithCountryCode } from "../utils/path";
import withGTM, { GTM } from "../utils/google-tag-manager";
import { isValidEmail } from "../utils/emailUtils";
import HiddenInput from "./HiddenInput";
import styles from "./styles/FormSection.module.scss";
import { useSiteContext } from "./Site";
import RichText, { RichTextData } from "./RichText";
import { Data as LinkData, isExternalUrl } from "./Link";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";

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
  source: SourceType | null;
  hubSpotFormGuid?: string | null;
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

export type widthType = "full" | "half";

export type InputType = {
  label: string;
  name: string;
  options?: string;
  required?: boolean;
  type: typeof InputTypes[number];
  width?: widthType;
  accept?: string;
  maxSize?: number;
  token?: string;
};

const convertMarkdownLinksToAnchorLinks = (
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

type FormInputs = {
  inputs: InputType[];
};

const FormInputs = ({ inputs }: FormInputs) => {
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
  backgroundColor,
  additionalValues,
  isSubmitDisabled,
  gtmOverride,
  onSuccess
}: {
  id?: string;
  data: Data;
  backgroundColor: "pearl" | "white";
  additionalValues?: Record<string, string>;
  isSubmitDisabled?: boolean;
  gtmOverride?: Partial<GTM>;
  onSuccess?: () => void;
}) => {
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

    if (process.env.GATSBY_PREVIEW) {
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
