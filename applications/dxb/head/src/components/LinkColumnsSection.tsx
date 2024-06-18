import AnchorLink from "@bmi-digital/components/anchor-link";
import ExpandableLinksTextCard from "@bmi-digital/components/expandable-links-text-card";
import MasonryGrid from "@bmi-digital/components/masonry-grid";
import Section from "@bmi-digital/components/section";
import { microCopy } from "@bmi/microcopies";
import { graphql } from "gatsby";
import React from "react";
import { useSiteContext } from "./Site";
import { toAnchorLinkActionProps } from "./link/utils";
import type { ExpandableLinksTextCardsProps } from "@bmi-digital/components/expandable-links-text-card";
import type { AnchorLinkProps } from "@bmi-digital/components/anchor-link";
import type { Data as LinkData, NavigationData } from "./link/types";

export type Data = {
  __typename: "ContentfulLinkColumnsSection";
  title: string | null;
  columns: NavigationData[];
};

const LinkColumnsSection = ({ data }: { data: Data }) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const { title, columns } = data;

  return (
    <Section backgroundColor="pearl" data-testid="link-columns-section">
      {title && <Section.Title>{title}</Section.Title>}
      <MasonryGrid>
        {columns &&
          columns.map(({ label, links }, index) => {
            const linksWithActions: ExpandableLinksTextCardsProps["links"] = (
              links || []
            )
              .filter((link) => link.__typename === "ContentfulLink")
              .map((link: LinkData) => {
                return {
                  ...toAnchorLinkActionProps(link, countryCode),
                  label: link.label
                };
              });

            return (
              <ExpandableLinksTextCard
                key={`${label}-${index}`}
                title={label ? label : undefined}
                openButtonLabel={getMicroCopy(microCopy.GLOBAL_VIEW_MORE)}
                closeButtonLabel={getMicroCopy(microCopy.GLOBAL_VIEW_LESS)}
                links={linksWithActions}
                anchorLinkComponent={(props: AnchorLinkProps) => (
                  <AnchorLink
                    gtm={{
                      id: "cta-click1",
                      action: props.href,
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
