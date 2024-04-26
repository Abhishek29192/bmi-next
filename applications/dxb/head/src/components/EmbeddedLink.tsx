import classnames from "classnames";
import { graphql } from "gatsby";
import React from "react";
import ButtonLink from "./link/ButtonLink";
import { Data as LinkData } from "./link/types";
import { StyledEmbeddedLink, classes } from "./styles/EmbeddedLink.styles";

type Props = {
  fields: LinkData;
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
  gtmLabel?: React.ReactNode;
};

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
    <StyledEmbeddedLink>
      <ButtonLink
        data={transformedFields}
        variant={theme === "primary" ? "contained" : "opaqueOutlined"}
        hasDarkBackground={backgroundTheme === "dark"}
        className={classnames([classes.embeddedLink], "embeddedLink")}
      >
        {fields.label}
      </ButtonLink>
    </StyledEmbeddedLink>
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
