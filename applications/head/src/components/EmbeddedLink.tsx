import React, { useContext } from "react";
import Button from "@bmi/button";
import { graphql } from "gatsby";
import { SiteContext } from "../components/Site";
import { LinkData, getClickableActionFromUrl } from "./Link";
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
  const { countryCode } = useContext(SiteContext);

  return (
    <Button
      variant={theme === "primary" ? "contained" : "outlined"}
      hasDarkBackground={backgroundTheme === "dark"}
      action={getClickableActionFromUrl(
        fields.linkedPage,
        fields.url,
        countryCode,
        fields.asset?.file?.url,
        fields.label
      )}
      className={styles["EmbeddedLink"]}
    >
      {fields.label}
    </Button>
  );
};

export default EmbeddedLink;

export const query = graphql`
  fragment EmbeddedLinkFragment on ContentfulLink {
    __typename
    contentful_id
    ...LinkFragment
  }
`;
