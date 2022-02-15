import React from "react";
import { graphql } from "gatsby";
import { PostItCard } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import { Button } from "@bmi-digital/components";
import { AnchorLink } from "@bmi-digital/components";
import { getClickableActionFromUrl, Data as LinkData } from "./Link";
import { useSiteContext } from "./Site";

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
  const { countryCode } = useSiteContext();

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
            <Component.Heading
              hasUnderline={hasUnderline}
              hasDarkBackground={cardTheme === "blue-900"}
            >
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
