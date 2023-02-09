import {
  AnchorLink,
  AnchorLinkProps,
  Button,
  ButtonProps,
  PostItCard,
  Typography
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import { Data as LinkData, getClickableActionFromUrl } from "./Link";
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

const GTMButton = withGTM<ButtonProps>(Button);
const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

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
                  <GTMButton
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
                    gtm={{
                      id: "cta-click1",
                      label: `${title} - ${link.label}`
                    }}
                  >
                    {link.label}
                  </GTMButton>
                ) : (
                  <GTMAnchorLink
                    action={getClickableActionFromUrl(
                      link.linkedPage,
                      link.url,
                      countryCode,
                      null,
                      link.label
                    )}
                    gtm={{
                      id: "cta-click1",
                      label: `${title} - ${link.label}`
                    }}
                  >
                    {link.label}
                  </GTMAnchorLink>
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
