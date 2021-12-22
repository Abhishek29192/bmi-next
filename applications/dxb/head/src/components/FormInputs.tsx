import React from "react";
import { graphql } from "gatsby";
import Checkbox from "@bmi/checkbox";
import Grid from "@bmi/grid";
import Select, { MenuItem } from "@bmi/select";
import TextField from "@bmi/text-field";
import Upload from "@bmi/upload";
import AnchorLink from "@bmi/anchor-link";
import matchAll from "string.prototype.matchall";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useConfig } from "../contexts/ConfigProvider";
import { useSiteContext } from "./Site";

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

  // TODO: Only allowing the first one to be a link for now.
  // Should loop matches through instead
  const [match, label, link] = matches[0];
  const { index: offset, input } = matches[0];

  return (
    <>
      {input.substring(0, offset)}
      {/* TODO: The link should be only rel="noopener" when linking to an external site. */}
      <AnchorLink
        action={{ model: "htmlLink", href: link }}
        target="_blank"
        rel="noopener"
      >
        {label}
      </AnchorLink>
      {input.substring(offset + match.length)}
    </>
  );
};

export type Data = InputType[];

const Input = ({
  label,
  name,
  options,
  type,
  required
}: Omit<InputType, "width">) => {
  const {
    config: { gcpFormUploadEndpoint }
  } = useConfig();
  const { getMicroCopy } = useSiteContext();
  const { executeRecaptcha } = useGoogleReCaptcha();

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
          fieldIsRequiredError={getMicroCopy("upload.fieldIsRequired")}
          uri={gcpFormUploadEndpoint}
          headers={{
            "Content-Type": "application/octet-stream"
          }}
          accept=".pdf,.jpg,.jpeg,.png"
          instructions={getMicroCopy("upload.instructions")}
          mapBody={(file) => ({ file })}
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
    case "select":
      return (
        <Select
          isRequired={required}
          label={label}
          name={name}
          fieldIsRequiredError={getMicroCopy("upload.fieldIsRequired")}
        >
          <MenuItem value="none">None</MenuItem>
          {options.split(/, |,/).map((option, $i) => (
            <MenuItem key={$i} value={option}>
              {option}
            </MenuItem>
          ))}
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
        />
      );
  }
};

const FormInputs = ({ data }: { data: Data }) => {
  return (
    <>
      {data.map(({ width, ...props }, $i) => (
        <Grid key={$i} item xs={12} md={width === "full" ? 12 : 6}>
          <Input {...props} />
        </Grid>
      ))}
    </>
  );
};

export default FormInputs;

export const query = graphql`
  fragment FormInputsFragment on ContentfulFormInputs {
    label
    name
    options
    type
    required
    width
  }
`;
