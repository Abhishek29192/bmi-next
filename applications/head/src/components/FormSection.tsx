import Checkbox from "@bmi/checkbox";
import Form from "@bmi/form";
import { InputValue } from "@bmi/form/src/withFormControl";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import Select, { MenuItem } from "@bmi/select";
import TextField from "@bmi/text-field";
import Upload, { getFileSizeString } from "@bmi/upload";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";
import { graphql, navigate } from "gatsby";
import React, { FormEvent, useContext, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { LinkData } from "./Link";
import RichText, { RichTextData } from "./RichText";
import { SiteContext } from "./Site";
import styles from "./styles/FormSection.module.scss";
// TODO: FormInputs should be updated and used here.
import { convertMarkdownLinksToAnchorLinks } from "./FormInputs";

const InputTypes = [
  "text",
  "email",
  "phone",
  "textarea",
  "checkbox",
  "select",
  "upload"
];

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
  const { getMicroCopy } = useContext(SiteContext);
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
        />
      );
    case "select":
      return (
        <Select isRequired={required} label={label} name={name}>
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
        />
      );
    case "textarea":
    case "text":
    default:
      return (
        <TextField
          name={name}
          isRequired={required}
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

const FormSection = ({
  data: {
    title,
    showTitle = true,
    description,
    recipients,
    inputs,
    submitText,
    successRedirect
  },
  backgroundColor
}: {
  data: Data;
  backgroundColor: "pearl" | "white";
}) => {
  const { countryCode, getMicroCopy, node_locale } = useContext(SiteContext);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();
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
            `/${countryCode}/${successRedirect.linkedPage.path}`
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

  return (
    <Section backgroundColor={backgroundColor}>
      {showTitle && <Section.Title>{title}</Section.Title>}
      {description && <RichText document={description} />}
      {inputs ? (
        <Form
          onSubmit={handleSubmit}
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
    </Section>
  );
};

export default FormSection;

export const query = graphql`
  fragment FormSectionFragment on ContentfulFormSection {
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
  }
`;
