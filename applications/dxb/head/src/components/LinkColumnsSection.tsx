import React from "react";
import { graphql } from "gatsby";
import AddIcon from "@material-ui/icons/Add";
import Button from "@bmi-digital/components/button";
import ExpandableLinksTextCard from "@bmi-digital/components/expandable-links-text-card";
import MasonryGrid from "@bmi-digital/components/masonry-grid";
import RemoveIcon from "@material-ui/icons/Remove";
import Section from "@bmi-digital/components/section";
import { ClickableAction } from "@bmi-digital/components/clickable";
import { microCopy } from "../constants/microCopies";
import { useSiteContext } from "./Site";
import {
  getClickableActionFromUrl,
  NavigationData,
  Data as LinkData
} from "./Link";

export type Data = {
  __typename: "ContentfulLinkColumnsSection";
  title: string | null;
  columns: NavigationData[];
};

const LinkColumnsSection = ({ data }: { data: Data }) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const { title, columns } = data;

  const openButton = (
    <Button
      variant="outlined"
      style={{ marginTop: "24px" }}
      endIcon={<AddIcon />}
    >
      {getMicroCopy(microCopy.GLOBAL_VIEW_MORE)}
    </Button>
  );
  const closeButton = (
    <Button
      variant="outlined"
      style={{ marginTop: "24px" }}
      endIcon={<RemoveIcon />}
    >
      {getMicroCopy(microCopy.GLOBAL_VIEW_LESS)}
    </Button>
  );

  return (
    <Section backgroundColor="pearl">
      {title && <Section.Title>{title}</Section.Title>}
      <MasonryGrid>
        {columns &&
          columns.map(({ label, links }, index) => {
            const linksWithActions = (links || [])
              .filter((link) => link.__typename === "ContentfulLink")
              .map((link: LinkData): {
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
              });

            return (
              <ExpandableLinksTextCard
                key={`${label}-${index}`}
                title={label}
                links={linksWithActions}
                openButton={openButton}
                closeButton={closeButton}
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
