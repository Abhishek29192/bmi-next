import AnchorLink, {
  AnchorLinkProps
} from "@bmi-digital/components/anchor-link";
import Button, { ButtonProps } from "@bmi-digital/components/button";
import { ClickableAction } from "@bmi-digital/components/clickable";
import ExpandableLinksTextCard from "@bmi-digital/components/expandable-links-text-card";
import AddIcon from "@bmi-digital/components/icon/Add";
import RemoveIcon from "@bmi-digital/components/icon/Remove";
import MasonryGrid from "@bmi-digital/components/masonry-grid";
import Section from "@bmi-digital/components/section";
import { microCopy } from "@bmi/microcopies";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import {
  Data as LinkData,
  NavigationData,
  getClickableActionFromUrl
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
    <Section backgroundColor="pearl" data-testid="link-columns-section">
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
                title={label || ""}
                links={linksWithActions}
                openButton={renderOpenButton(label || "")}
                closeButton={renderCloseButton(label || "")}
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
