import Checkbox from "@bmi/checkbox";
import Form from "@bmi/form";
import { InputValue } from "@bmi/form/src/withFormControl";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import Select, { MenuItem } from "@bmi/select";
import TextField from "@bmi/text-field";
import Upload from "@bmi/upload";
import { Document } from "@contentful/rich-text-types";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";
import { graphql, navigate } from "gatsby";
import React, { FormEvent, useContext } from "react";
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
  required
}: Omit<InputType, "width">) => {
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
          accept=".pdf,.jpg,.jpeg,.png"
          instructions="Supported formats: PDF, JPG, JPEG and PNG"
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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();

    // @todo: This needs to be less reliant on string patterns
    const conditionalRecipients = (values.recipients as string) || recipients;

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

      if (successRedirect) {
        navigate(
          successRedirect.url ||
            `/${countryCode}/${successRedirect.linkedPage.slug}`
        );
      } else {
        navigate("/");
      }
    } catch (error) {
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
            <Form.SubmitButton endIcon={<ArrowForwardIcon />}>
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
    }
    submitText
    successRedirect {
      ...LinkFragment
    }
  }
`;
