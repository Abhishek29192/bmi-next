import React, { useContext } from "react";
import { graphql } from "gatsby";
import ExploreBar from "@bmi/explore-bar";
import { LinkData, getClickableActionFromUrl } from "./Link";
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
      links={links.map(({ label, linkedPage, url, asset }) => ({
        label,
        action: getClickableActionFromUrl(
          linkedPage,
          url,
          countryCode,
          asset?.file?.url
        )
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
