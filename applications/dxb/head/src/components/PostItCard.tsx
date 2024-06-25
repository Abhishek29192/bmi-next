import AnchorLink from "@bmi-digital/components/anchor-link";
import Button from "@bmi-digital/components/button";
import PostItCard from "@bmi-digital/components/post-it-card";
import Typography from "@bmi-digital/components/typography";
import { graphql } from "gatsby";
import React from "react";
import { useSiteContext } from "./Site";
import { type Data as LinkData } from "./link/types";
import { toAnchorLinkActionProps, toButtonActionProps } from "./link/utils";

export type Props = {
  cardTheme: "pearl" | "blue900";
  cardSections: Data[];
  Component?: typeof PostItCard;
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
    <Component color={cardTheme}>
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
              hasDarkBackground={cardTheme === "blue900"}
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
                    {...(cardTheme === "blue900"
                      ? { hasDarkBackground: true, variant: "outlined" }
                      : {})}
                    {...toButtonActionProps(link, countryCode)}
                    gtm={{
                      id: "cta-click1",
                      label: `${title} - ${link.label}`
                    }}
                  >
                    {link.label}
                  </Button>
                ) : (
                  <AnchorLink
                    {...toAnchorLinkActionProps({
                      ...link,
                      label: `${title} - ${link.label}`
                    })}
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
