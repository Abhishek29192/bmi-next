import Checkbox from "@bmi/checkbox";
import Form from "@bmi/form";
import { InputValue } from "@bmi/form/src/withFormControl";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import Select, { MenuItem } from "@bmi/select";
import TextField from "@bmi/text-field";
import Upload, { getFileSizeString } from "@bmi/upload";
import { Document } from "@contentful/rich-text-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";
import { graphql, navigate } from "gatsby";
import React, { FormEvent, useContext, useState } from "react";
import { LinkData } from "./Link";
import RichText from "./RichText";
import { SiteContext } from "./Site";
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

type InputType = {
  label: string;
  name: string;
  options?: string;
  required?: boolean;
  type: typeof InputTypes[number];
  width?: "full" | "half";
  accept?: string;
  maxSize?: number;
};

export type Data = {
  __typename: "ContentfulFormSection";
  title: string;
  showTitle: boolean | null;
  description?: { json: Document } | null;
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

  const handleFileValidation = (file: File) => {
    if (maxSize && file.size > maxSize * 1048576) {
      return getMicroCopy("errors.maxSize").replace(
        "{{size}}",
        getFileSizeString(maxSize * 1048576)
      );
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
          headers={{ "Content-Type": "application/octet-stream" }}
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
          mapBody={(file) => ({ file })}
          mapValue={mapValue}
        />
      );
    case "select":
      return (
        <Select isRequired={required} label={label} name={name}>
          <MenuItem value="none">None</MenuItem>
          {options.split(/, |,/).map((option, $i) => {
            const [string, value] = option.split(/= |=/);
            return (
              <MenuItem key={$i} value={value || string}>
                {string}
              </MenuItem>
            );
          })}
        </Select>
      );
    case "checkbox":
      return <Checkbox name={name} label={label} isRequired={required} />;
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
  const { countryCode, getMicroCopy } = useContext(SiteContext);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();
    setIsSubmitting(true);

    // @todo: This needs to be less reliant on string patterns
    const recipientsFromValues = values.recipients as string;
    const conditionalRecipients = recipientsFromValues.includes("@")
      ? recipientsFromValues
      : recipients;

    try {
      const source = axios.CancelToken.source();
      await axios.post(
        process.env.GATSBY_GCP_FORM_SUBMIT_ENDPOINT,
        {
          locale: "en-US",
          title,
          recipients: conditionalRecipients.split(/, |,/),
          values
        },
        {
          cancelToken: source.token
        }
      );

      setIsSubmitting(false);
      if (successRedirect) {
        navigate(
          successRedirect.url ||
            `/${countryCode}/${successRedirect.linkedPage.slug}`
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
      {description && <RichText document={description.json} />}
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
      json
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
