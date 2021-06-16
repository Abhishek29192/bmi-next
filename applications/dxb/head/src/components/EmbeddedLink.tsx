import React from "react";
import Button from "@bmi/button";
import { graphql } from "gatsby";
import Link, { Data as LinkData } from "./Link";
import styles from "./styles/EmbeddedLink.module.scss";

type Props = {
  fields: LinkData;
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
};

const EmbeddedLink = ({
  fields,
  theme = "primary",
  backgroundTheme = "light"
}: Props) => {
  return (
    <Link
      component={Button}
      variant={theme === "primary" ? "contained" : "outlined"}
      hasDarkBackground={backgroundTheme === "dark"}
      data={fields}
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
