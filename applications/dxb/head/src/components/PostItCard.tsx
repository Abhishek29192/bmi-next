import { useIsClient } from "@bmi-digital/components";
import AnchorLink, {
  AnchorLinkProps
} from "@bmi-digital/components/anchor-link";
import Button, { ButtonProps } from "@bmi-digital/components/button";
import PostItCard from "@bmi-digital/components/post-it-card";
import Typography from "@bmi-digital/components/typography";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import memoize from "../utils/memoize";
import { Data as LinkData, getClickableActionFromUrl } from "./Link";
import { useSiteContext } from "./Site";

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

const GTMButton = withGTM<ButtonProps>(Button);
const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

const IntegratedPostItCard = ({
  cardTheme,
  cardSections,
  Component = PostItCard
}: Props) => {
  const { countryCode } = useSiteContext();
  const { isClient } = useIsClient();
  const memoizedGetClickableActionFromUrl = memoize(getClickableActionFromUrl);

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
                  <GTMButton
                    {...(cardTheme === "blue900"
                      ? { hasDarkBackground: true, variant: "outlined" }
                      : {})}
                    action={memoizedGetClickableActionFromUrl(
                      {
                        isSSR: !isClient,
                        linkedPage: link.linkedPage,
                        url: link.url,
                        countryCode,
                        label: link.label
                      },
                      []
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
                    action={memoizedGetClickableActionFromUrl(
                      {
                        isSSR: !isClient,
                        linkedPage: link.linkedPage,
                        url: link.url,
                        countryCode,
                        label: link.label
                      },
                      []
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
