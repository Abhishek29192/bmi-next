import {
  AnchorLink,
  AnchorLinkProps,
  Button,
  ButtonProps,
  ClickableAction,
  ExpandableLinksTextCard,
  MasonryGrid,
  Section
} from "@bmi-digital/components";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { graphql } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import {
  Data as LinkData,
  getClickableActionFromUrl,
  NavigationData
} from "./Link";
import { useSiteContext } from "./Site";

export type Data = {
  __typename: "ContentfulLinkColumnsSection";
  title: string | null;
  columns: NavigationData[];
};

const GTMButton = withGTM<ButtonProps>(Button);
const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

const LinkColumnsSection = ({ data }: { data: Data }) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const { title, columns } = data;

  const renderOpenButton = (title: string) => (
    <GTMButton
      variant="outlined"
      style={{ marginTop: "24px" }}
      endIcon={<AddIcon />}
      gtm={{
        id: "cta-click1",
        action: "Expand choice of links",
        label: `${title} - ${getMicroCopy(microCopy.GLOBAL_VIEW_MORE)}`
      }}
    >
      {getMicroCopy(microCopy.GLOBAL_VIEW_MORE)}
    </GTMButton>
  );
  const renderCloseButton = (title: string) => (
    <GTMButton
      variant="outlined"
      style={{ marginTop: "24px" }}
      endIcon={<RemoveIcon />}
      gtm={{
        id: "cta-click1",
        action: "Decrease choice of links",
        label: `${title} - ${getMicroCopy(microCopy.GLOBAL_VIEW_LESS)}`
      }}
    >
      {getMicroCopy(microCopy.GLOBAL_VIEW_LESS)}
    </GTMButton>
  );

  return (
    <Section backgroundColor="pearl">
      {title && <Section.Title>{title}</Section.Title>}
      <MasonryGrid>
        {columns &&
          columns.map(({ label, links }, index) => {
            const linksWithActions = (links || [])
              .filter((link) => link.__typename === "ContentfulLink")
              .map(
                (
                  link: LinkData
                ): {
                  action: ClickableAction | undefined;
                  label: string;
                } => {
                  const action = getClickableActionFromUrl(
                    link.linkedPage,
                    link.url,
                    countryCode,
                    link.asset ? `https:${link.asset?.file?.url}` : undefined,
                    link.label
                  );

                  return {
                    action,
                    label: link.label
                  };
                }
              );

            return (
              <ExpandableLinksTextCard
                key={`${label}-${index}`}
                title={label}
                links={linksWithActions}
                openButton={renderOpenButton(label)}
                closeButton={renderCloseButton(label)}
                anchorLinkComponent={(props: AnchorLinkProps) => (
                  <GTMAnchorLink
                    gtm={{
                      id: "cta-click1",
                      action: props.action?.href,
                      label: `${label} - ${props.children}`
                    }}
                    {...props}
                  />
                )}
              />
            );
          })}
      </MasonryGrid>
    </Section>
  );
};

export default LinkColumnsSection;

export const query = graphql`
  fragment LinkColumnsSectionFragment on ContentfulLinkColumnsSection {
    title
    columns {
      ... on ContentfulNavigation {
        label
        links {
          ...LinkFragment
        }
      }
    }
  }
`;
