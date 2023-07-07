import { useHubspotForm } from "@aaronhayes/react-use-hubspot-form";
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
  replaceSpaces,
  Section,
  Select,
  SelectMenuItem,
  TextField,
  Typography,
  Upload,
  useIsClient
} from "@bmi-digital/components";
import { ArrowForward as ArrowForwardIcon } from "@bmi-digital/components/icon";
import logger from "@bmi-digital/functions-logger";
import classNames from "classnames";
import { graphql, navigate } from "gatsby";
import uniqueId from "lodash-es/uniqueId";
import fetch from "node-fetch";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import matchAll from "string.prototype.matchall";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import { isValidEmail } from "../utils/emailUtils";
import getCookie from "../utils/getCookie";
import withGTM, { GTM } from "../utils/google-tag-manager";
import { isRichText } from "../utils/isRichText";
import { getPathWithCountryCode } from "../utils/path";
import ControlledCheckboxGroup from "./CheckboxGroup";
import HiddenInput from "./HiddenInput";
import { isExternalUrl, Data as LinkData } from "./Link";
import ProgressIndicator from "./ProgressIndicator";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import {
  classes,
  HubspotFormWrapper,
  StyledForm
} from "./styles/FormSectionStyles";
import { SourceType } from "./types/FormSectionTypes";

export type Data = {
  __typename: "ContentfulFormSection";
  title?: string;
  showTitle: boolean | null;
  description?: React.ReactNode | RichTextData | null;
  recipients: string;
  inputs: InputType[] | null;
  submitText: string | null;
  successRedirect: LinkData | null;
  source: SourceType;
  hubSpotFormGuid?: string | null;
  sample_ids?: string | null;
  emailSubjectFormat?: string;
};

type InputTypes =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "checkbox"
  | "checkboxGroup"
  | "radio"
  | "select"
  | "upload"
  | "hubspot-text"
  | "hubspot-checkbox"
  | "hubspot-hidden";

export type InputWidthType = "full" | "half";

export type InputType = {
  label: string;
  name: string;
  options?: string;
  required?: boolean;
  type: InputTypes;
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
          data-testid={`label-${replaceSpaces(label)}-anchor-link`}
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
  const { isClient } = useIsClient();
  const { gcpFormUploadEndpoint } = useConfig();
  const { getMicroCopy } = useSiteContext();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);

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

  const handleEmailValidation = useCallback(
    (value: string) => {
      // Has a full stop and a `@`, and at least one character in between both.
      if (value.match(/.+@.+\..+/)) {
        return false;
      } else {
        return getMicroCopy(microCopy.ERRORS_EMAIL_INVALID);
      }
    },
    [getMicroCopy]
  );

  const handleFileValidation = useCallback(
    (file: File) => {
      if (maxSize && file.size > maxSize * 1048576) {
        return getMicroCopy(microCopy.ERRORS_MAX_SIZE, {
          size: getFileSizeString(maxSize * 1048576)
        });
      }
    },
    [getMicroCopy, maxSize]
  );

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
          mapValue={mapValue}
          onUploadRequest={async () => {
            const token = qaAuthToken ? undefined : await executeRecaptcha?.();
            let headers: HeadersInit = {
              "X-Recaptcha-Token": token
            };
            if (qaAuthToken) {
              headers = { ...headers, authorization: `Bearer ${qaAuthToken}` };
            }

            return { headers: { ...headers } };
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
            {options?.split(/, |,/).map((option, $i) => (
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
          defaultValue={microCopy.FORM_NONE_SELECTION}
        >
          <SelectMenuItem value={microCopy.FORM_NONE_SELECTION}>
            {getMicroCopy(microCopy.FORM_NONE_SELECTION)}
          </SelectMenuItem>
          {options?.split(/, |,/).map((option, $i) => {
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
          isRequired={Boolean(required)}
          fieldIsRequiredError={getMicroCopy(
            microCopy.UPLOAD_FIELD_IS_REQUIRED
          )}
        />
      );
    case "hubspot-text":
      return (
        <>
          <Typography>
            {isClient && (
              <span dangerouslySetInnerHTML={{ __html: label }}></span>
            )}
          </Typography>
          <HiddenInput name={name} value={label} />
        </>
      );
    case "hubspot-checkbox":
      return (
        <Checkbox
          name={name}
          label={
            isClient ? (
              <span dangerouslySetInnerHTML={{ __html: label }}></span>
            ) : (
              <span></span>
            )
          }
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
          id={name}
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
      {inputs.map(({ width, name, ...props }, $i) => (
        <Grid key={$i} xs={12} md={width === "full" ? 12 : 6}>
          <Input name={name} data-testid={`form-input-${name}`} {...props} />
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
  onFormReady,
  onFormLoadError,
  additionalValues,
  className,
  hasNoPadding,
  isDialog = false
}: {
  id?: string;
  hubSpotFormGuid: string;
  backgroundColor: "pearl" | "white";
  showTitle: boolean | null;
  title?: string;
  description?: RichTextData | React.ReactNode;
  onSuccess: FormSectionProps["onSuccess"];
  onFormReady?: FormSectionProps["onFormReady"];
  onFormLoadError?: FormSectionProps["onFormLoadError"];
  additionalValues: FormSectionProps["additionalValues"];
  className?: string;
  isDialog?: boolean;
  hasNoPadding?: boolean;
}) => {
  const { hubSpotId } = useConfig();
  const hubSpotFormID = useMemo(() => {
    if (id) {
      return `bmi-hubspot-form-${id}`;
    }

    return `bmi-hubspot-form-${uniqueId(replaceSpaces(title))}`;
  }, [id, title]);

  // Uses the HS script to bring in the form. This will create an iframe regardless
  // of styling options, but will only _use_ the iframe if it's _not_ raw HTML (empty
  // iframe otherwise).
  useHubspotForm({
    portalId: hubSpotId || "",
    formId: hubSpotFormGuid,
    target: `#${hubSpotFormID}`
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data.type === "hsFormCallback" &&
        event.data.eventName === "onFormReady"
      ) {
        const iframeElement = document.querySelector<HTMLIFrameElement>(
          `#${hubSpotFormID} iframe`
        );
        const hubspotform = document.querySelector<HTMLFormElement>(
          `#${hubSpotFormID} form`
        );

        if (additionalValues && additionalValues["samples"]) {
          const sampleIdsInput = document.querySelector<HTMLInputElement>(
            'input[name="sample_ids"]'
          );

          if (sampleIdsInput) {
            sampleIdsInput.value = additionalValues["samples"];
          } else {
            const hiddenInput =
              iframeElement?.contentWindow?.document.querySelector<HTMLInputElement>(
                'input[name="sample_ids"]'
              );
            hiddenInput && (hiddenInput.value = additionalValues["samples"]);
          }
        }
        if (isDialog) {
          onFormReady?.(event, hubspotform);
        } else {
          onFormReady?.(event, iframeElement);
        }
      }

      if (event.data.eventName === "onFormSubmitted") {
        onSuccess?.();
      }

      if (event.data.eventName === "onFormDefinitionFetchError") {
        onFormLoadError?.();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("message", handleMessage);
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [
    additionalValues,
    hubSpotFormID,
    isDialog,
    onFormLoadError,
    onFormReady,
    onSuccess
  ]);

  return (
    <Section
      backgroundColor={backgroundColor}
      className={className}
      isDialog={isDialog}
      hasNoPadding={hasNoPadding}
      data-testid={`hubspot-form-section-${replaceSpaces(title)}`}
    >
      {showTitle && <Section.Title>{title}</Section.Title>}
      {description && (
        <>
          {isRichText(description) ? (
            <RichText document={description} />
          ) : (
            description
          )}
        </>
      )}
      <HubspotFormWrapper
        data-testid={`hubspot-form-${replaceSpaces(title)}`}
        id={hubSpotFormID}
        className={classNames(isDialog && classes.dialog)}
      />
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
  onFormReady?: (
    event: MessageEvent,
    hsForm?: HTMLIFrameElement | HTMLFormElement
  ) => void;
  onFormLoadError?: () => void;
  className?: string;
  isDialog?: boolean;
  hasNoPadding?: boolean;
  "data-testid"?: string;
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
  onSuccess,
  onFormReady,
  onFormLoadError,
  className,
  hasNoPadding,
  isDialog = false,
  "data-testid": dataTestId
}: FormSectionProps) => {
  const { isPreviewMode, gcpFormSubmitEndpoint, hubspotApiUrl, hubSpotId } =
    useConfig();
  const { countryCode, getMicroCopy, node_locale } = useSiteContext();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);
  const GTMButton = withGTM<ButtonProps>(Button, {
    label: "aria-label",
    action: "data-action"
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
      const token = qaAuthToken ? undefined : await executeRecaptcha?.();

      // remove all blank values
      const valuesToSent = Object.entries(values).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value) && !value.length) {
            return acc;
          }
          return value ? ((acc[`${key}`] = value), acc) : acc;
        },
        {}
      );

      let headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-Recaptcha-Token": token
      };
      if (qaAuthToken) {
        headers = { ...headers, authorization: `Bearer ${qaAuthToken}` };
      }
      const response = await fetch(gcpFormSubmitEndpoint, {
        method: "POST",
        body: JSON.stringify({
          locale: node_locale,
          title,
          recipients: conditionalRecipients,
          values: valuesToSent,
          emailSubjectFormat
        }),
        headers
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      onSuccess && onSuccess();

      if (successRedirect) {
        navigate(
          successRedirect.url ||
            getPathWithCountryCode(
              countryCode,
              successRedirect.linkedPage?.path
            )
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      logger.error({ message: (error as Error).message });
    }

    setIsSubmitting(false);
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

    const getLegalOptions = (hsLegalFields: { [key: string]: InputValue }) => {
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
      const response = await fetch(
        `${hubspotApiUrl}${hubSpotId}/${hubSpotFormGuid}`,
        {
          method: "POST",
          body: JSON.stringify({
            ...hsPayload,
            ...(hsLegalFields
              ? {
                  legalConsentOptions: getLegalOptions(hsLegalFields)
                }
              : {})
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (successRedirect) {
        navigate(
          successRedirect.url ||
            getPathWithCountryCode(
              countryCode,
              successRedirect.linkedPage?.path
            )
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      logger.error({ message: (error as Error).message });
    }

    setIsSubmitting(false);
  };

  if (source === SourceType.HubSpot && hubSpotFormGuid) {
    return (
      <HubspotForm
        id={id}
        hubSpotFormGuid={hubSpotFormGuid}
        backgroundColor={backgroundColor}
        showTitle={showTitle && !isDialog}
        title={title}
        description={description}
        onSuccess={onSuccess}
        onFormReady={onFormReady}
        onFormLoadError={onFormLoadError}
        additionalValues={additionalValues}
        className={className}
        isDialog={isDialog}
        hasNoPadding={hasNoPadding}
        data-testid={dataTestId}
      />
    );
  }
  return (
    <Section
      backgroundColor={backgroundColor}
      className={className}
      hasNoPadding={hasNoPadding}
      data-testid={`contentful-form-section-${replaceSpaces(title)}`}
    >
      {showTitle && <Section.Title>{title}</Section.Title>}
      {description && (
        <>
          {isRichText(description) ? (
            <RichText document={description} />
          ) : (
            description
          )}
        </>
      )}
      {inputs ? (
        <StyledForm
          onSubmit={
            // TODO Handle/remove after HubSpot mapping has been decided
            source === SourceType.HubSpot && hubSpotFormGuid
              ? handleHubSpotSubmit
              : handleSubmit
          }
          rightAlignButton
          data-testid={dataTestId}
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
                    data-action={
                      gtmOverride?.action ? gtmOverride?.action : title
                    }
                  />
                );
              }}
              endIcon={
                isSubmitting ? (
                  <ProgressIndicator
                    size={24}
                    color="inherit"
                    style={{
                      position: "relative",
                      left: 0,
                      right: 0,
                      marginLeft: "0.5rem"
                    }}
                  />
                ) : (
                  <ArrowForwardIcon />
                )
              }
              disabled={isSubmitting || isSubmitDisabled}
              data-testid={`contentful-form-section-${replaceSpaces(
                title
              )}-submit-button`}
            >
              {submitText || getMicroCopy(microCopy.FORM_SUBMIT)}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </StyledForm>
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
