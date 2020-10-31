import Checkbox from "@bmi/checkbox";
import Form from "@bmi/form";
import { InputValue } from "@bmi/form/src/withFormControl";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import Select, { MenuItem } from "@bmi/select";
import TextField from "@bmi/text-field";
import Upload from "@bmi/upload";
import { graphql } from "gatsby";
import React, { FormEvent } from "react";
import RichText from "./RichText";
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
  showTitle?: boolean;
  description?: { json: any };
  action?: string;
  method?: string;
  inputs?: InputType[];
  submitText?: string;
};

const Input = ({
  label,
  name,
  options,
  type,
  required
}: Omit<InputType, "width">) => {
  const mapValue = (_, response) => response.sys.id;
  const mapBody = (file) => ({
    fields: {
      title: {
        "en-US": "Asset title"
      },
      description: {
        "en-US": "Asset description"
      },
      file: {
        "en-US": {
          contentType: file.type,
          fileName: file.name,
          file
        }
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
          uri="https://run.mocky.io/v3/eb9e5061-31c2-4329-9e4a-3de6068ca6ac"
          headers={{ "Content-Type": "application/octet-stream" }}
          accept=".pdf,.jpg,.jpeg,.png"
          instructions="Supported formats: PDF, JPG, JPEG and PNG"
          mapBody={mapBody}
          mapValue={mapValue}
        />
      );
    case "select":
      return (
        <Select isRequired={required} label={label} name={name}>
          <MenuItem value="none">None</MenuItem>
          {options.split(/, |,/).map((option, $i) => (
            <MenuItem key={$i} value={option}>
              {option}
            </MenuItem>
          ))}
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
    action,
    method = "post",
    inputs,
    submitText = "Submit"
  },
  backgroundColor
}: {
  data: Data;
  backgroundColor: "pearl" | "white";
}) => {
  const onSubmit = (
    event: FormEvent<HTMLFormElement>,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();
    // console.log("Submit event", event, values); // @todo: Form submission
  };

  return (
    <Section backgroundColor={backgroundColor}>
      {showTitle && <Section.Title>{title}</Section.Title>}
      <RichText document={description.json} />
      {inputs ? (
        <Form onSubmit={onSubmit} className={styles["Form"]} rightAlignButton>
          <Grid container spacing={3}>
            {inputs.map(({ width, ...props }, $i) => (
              <Grid key={$i} item xs={12} md={width === "full" ? 12 : 6}>
                <Input {...props} />
              </Grid>
            ))}
          </Grid>
          <Form.SubmitButton>{submitText}</Form.SubmitButton>
        </Form>
      ) : null}
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
    action
    method
    inputs {
      label
      name
      options
      type
      required
      width
    }
    submitText
  }
`;
