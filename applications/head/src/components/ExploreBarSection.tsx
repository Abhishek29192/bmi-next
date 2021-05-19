import ExploreBar from "@bmi/explore-bar";
import Section from "@bmi/section";
import { graphql } from "gatsby";
import React, { useContext } from "react";
import { getClickableActionFromUrl, LinkData } from "./Link";
import { SiteContext } from "./Site";

export type Data = {
  __typename: "ContentfulNavigation";
  label: string | null;
  links: LinkData[];
};

const ExploreBarSection = ({ data }: { data: Data }) => {
  const { countryCode } = useContext(SiteContext);
  const { label, links } = data;

  return (
    <Section>
      <ExploreBar
        heading={label}
        links={links.map(({ label, linkedPage, url, asset }) => ({
          label,
          action: getClickableActionFromUrl(
            linkedPage,
            url,
            countryCode,
            asset?.file?.url,
            label
          )
        }))}
      />
    </Section>
  );
};

export default ExploreBarSection;

export const query = graphql`
  fragment ExploreBarSectionFragment on ContentfulNavigation {
    label
    links {
      ...LinkFragment
    }
  }
`;
