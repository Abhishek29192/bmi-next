import { useHubspotForm } from "@aaronhayes/react-use-hubspot-form";
import AnchorLink from "@bmi-digital/components/anchor-link";
import Checkbox from "@bmi-digital/components/checkbox";
import Form, { InputValue } from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import RadioGroup from "@bmi-digital/components/radio-group";
import Section from "@bmi-digital/components/section";
import Select, {
  MenuItem as SelectMenuItem
} from "@bmi-digital/components/select";
import TextField from "@bmi-digital/components/text-field";
import Typography from "@bmi-digital/components/typography";
import Upload, { getFileSizeString } from "@bmi-digital/components/upload";
import { replaceSpaces } from "@bmi-digital/components/utils";
import logger from "@bmi-digital/functions-logger";
import { microCopy } from "@bmi/microcopies";
import classNames from "classnames";
import uniqueId from "lodash-es/uniqueId";
import { useRouter } from "next/navigation";
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
import { GTM } from "@bmi-digital/components";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { useConfig } from "../contexts/ConfigProvider";
import {
  isValidEmail,
  handleEmailValidation as validateEmail
} from "../utils/emailUtils";
import getCookie from "../utils/getCookie";
import { isRichText } from "../utils/isRichText";
import { getPathWithCountryCode } from "../utils/path";
import ControlledCheckboxGroup from "./CheckboxGroup";
import ProgressIndicator from "./ProgressIndicator";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import { isExternalUrl } from "./link/utils";
import {
  HubspotFormWrapper,
  StyledForm,
  classes
} from "./styles/FormSectionStyles";
import { SourceType } from "./types/FormSectionTypes";
import type { Data as LinkData } from "./link/types";

export type Data = {
  __typename: "Form";
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
  formId?: string;
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

  return matches.filter(Boolean).map((el, index) => {
    const [match, label, link] = el;
    const { index: offset, input } = el;
    return (
      <div key={`hubspot-markdown-link${index}`}>
        {input.substring(0, offset)}
        <AnchorLink
          href={link}
          external={isExternalUrl(link) || undefined}
          data-testid={`label-${replaceSpaces(label)}-anchor-link`}
        >
          {label}
        </AnchorLink>
        {input.substring(offset + match.length)}
      </div>
    );
  });
};

const Input = ({
  formId,
  label,
  name,
  options,
  type,
  required,
  accept = ".pdf, .jpg, .jpeg, .png",
  maxSize
}: Omit<InputType, "width">) => {
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
    (value: string) =>
      validateEmail(getMicroCopy(microCopy.ERRORS_EMAIL_INVALID), value),
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

  const onUploadRequest = useCallback(async () => {
    const token = qaAuthToken ? undefined : await executeRecaptcha?.();
    let headers: HeadersInit = {
      "X-Recaptcha-Token": token
    };
    if (qaAuthToken) {
      headers = { ...headers, authorization: `Bearer ${qaAuthToken}` };
    }

    return { headers: { ...headers } };
  }, [executeRecaptcha, qaAuthToken]);

  switch (type) {
    case "upload":
      return (
        <Upload
          id={`${formId}-${name}`}
          formId={formId}
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
          onUploadRequest={onUploadRequest}
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
  formId?: string;
  inputs: InputType[];
};

export const FormInputs = ({ formId, inputs }: FormInputs) => (
  <>
    {inputs.map(({ width, name, ...props }) => (
      <Grid key={`${formId}-${name}`} xs={12} md={width === "full" ? 12 : 6}>
        <Input
          formId={formId}
          name={name}
          data-testid={`form-input-${name}`}
          {...props}
        />
      </Grid>
    ))}
  </>
);

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
  id: string;
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
    if (id.length > 0) {
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
  id: string;
  data: Data;
  backgroundColor: "pearl" | "white";
  additionalValues?: Record<string, string>;
  sampleIds?: string;
  isSubmitDisabled?: boolean;
  gtmOverride?: { action?: GTM["action"]; label?: GTM["label"] };
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
  const { isPreviewMode, gcpFormSubmitEndpoint } = useConfig();
  const { countryCode, getMicroCopy, node_locale } = useSiteContext();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);
  const router = useRouter();

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
        router.push(
          successRedirect.url ||
            getPathWithCountryCode(
              countryCode,
              successRedirect.linkedPage?.path
            )
        );
      } else {
        router.push("/");
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
          onSubmit={handleSubmit}
          rightAlignButton
          data-testid={dataTestId}
        >
          <Grid container spacing={3}>
            <FormInputs formId={id} inputs={inputs} />
          </Grid>
          <Form.ButtonWrapper>
            <Form.SubmitButton
              gtm={{
                id: "form-button1",
                action: gtmOverride?.action ? gtmOverride.action : title,
                label: gtmOverride?.label ? gtmOverride.label : "children"
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
