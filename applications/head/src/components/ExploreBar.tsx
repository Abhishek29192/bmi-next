import React, { useContext } from "react";
import { graphql } from "gatsby";
import { LinkData, getClickableActionFromUrl } from "./Link";
import ExploreBar from "@bmi/explore-bar";
import { SiteContext } from "./Site";

export type Data = {
  label: string;
  links: LinkData[];
};

const IntegratedExploreBar = ({ data }: { data: Data }) => {
  const { countryCode } = useContext(SiteContext);
  const { label, links } = data;

  return (
    <ExploreBar
      heading={label}
      links={links.map(({ label, linkedPage, url }) => ({
        label,
        action: getClickableActionFromUrl(linkedPage, url, countryCode)
      }))}
    />
  );
};

export default IntegratedExploreBar;

export const query = graphql`
  fragment ExploreBarFragment on ContentfulNavigation {
    label
    links {
      ...LinkFragment
    }
  }
`;
