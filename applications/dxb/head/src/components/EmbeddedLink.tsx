import { Button, ButtonProps } from "@bmi/components";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import Link, { Data as LinkData } from "./Link";
import styles from "./styles/EmbeddedLink.module.scss";

type Props = {
  fields: LinkData;
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
  gtmLabel?: React.ReactNode;
};

const GTMButton = withGTM<ButtonProps>(Button);

const EmbeddedLink = ({
  fields,
  theme = "primary",
  backgroundTheme = "light",
  gtmLabel
}: Props) => {
  const transformedFields = {
    ...fields,
    label: gtmLabel ? `${gtmLabel} - ${fields.label}` : fields.label
  };
  return (
    <Link
      component={(props) => (
        <GTMButton
          gtm={{
            id: "cta-click1",
            action: fields.url || fields.linkedPage?.path,
            label: transformedFields.label
          }}
          {...props}
        />
      )}
      variant={theme === "primary" ? "contained" : "opaqueOutlined"}
      hasDarkBackground={backgroundTheme === "dark"}
      data={transformedFields}
      className={styles["EmbeddedLink"]}
    >
      {fields.label}
    </Link>
  );
};

export default EmbeddedLink;

export const query = graphql`
  fragment EmbeddedLinkFragment on ContentfulLink {
    __typename
    contentful_id
    ...LinkFragment
  }
  fragment EmbeddedLinkFragmentNonRecursive on ContentfulLink {
    __typename
    contentful_id
    ...LinkFragmentNonRecursive
  }
`;
