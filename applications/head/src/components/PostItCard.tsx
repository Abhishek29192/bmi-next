import React, { useContext } from "react";
import { graphql } from "gatsby";
import PostItCard from "@bmi/post-it-card";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import AnchorLink from "@bmi/anchor-link";
import { getClickableActionFromUrl, LinkData } from "./Link";
import { SiteContext } from "./Site";

export type Props = {
  cardTheme: "pearl" | "blue-900";
  cardSections: Data[];
  Component?: any;
};

export type Data = {
  id: string;
  title: string;
  hasUnderline: boolean;
  description: {
    description: string;
  };
  link: LinkData | null;
  linkType: "button" | "link" | null;
};

const IntegratedPostItCard = ({
  cardTheme,
  cardSections,
  Component = PostItCard
}: Props) => {
  const { countryCode } = useContext(SiteContext);

  return (
    <Component theme={cardTheme}>
      {cardSections.map(
        ({
          id,
          title,
          hasUnderline,
          description,
          link,
          linkType = "button"
        }) => (
          <Component.Section key={id}>
            <Component.Heading hasUnderline={hasUnderline}>
              {title}
            </Component.Heading>
            <Component.Content>
              <Typography>{description.description}</Typography>
            </Component.Content>
            {link && (
              <Component.Action>
                {linkType === "button" ? (
                  <Button
                    {...(cardTheme === "blue-900"
                      ? { hasDarkBackground: true, variant: "outlined" }
                      : {})}
                    action={getClickableActionFromUrl(
                      link.linkedPage,
                      link.url,
                      countryCode,
                      null,
                      link.label
                    )}
                  >
                    {link.label}
                  </Button>
                ) : (
                  <AnchorLink
                    action={getClickableActionFromUrl(
                      link.linkedPage,
                      link.url,
                      countryCode,
                      null,
                      link.label
                    )}
                  >
                    {link.label}
                  </AnchorLink>
                )}
              </Component.Action>
            )}
          </Component.Section>
        )
      )}
    </Component>
  );
};

export default IntegratedPostItCard;

export const query = graphql`
  # TODO: If this is a Section it should go under the Section type. Have to check because I don't fully understand.
  fragment PostItCardSectionFragment on ContentfulPostItCardSection {
    id
    hasUnderline
    title
    description {
      description
    }
    link {
      ...LinkFragment
    }
  }
`;
