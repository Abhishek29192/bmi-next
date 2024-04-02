import { useIsClient } from "@bmi-digital/components";
import ExploreBar from "@bmi-digital/components/explore-bar";
import { graphql } from "gatsby";
import React from "react";
import memoize from "../utils/memoize";
import { Data as LinkData, getClickableActionFromUrl } from "./Link";
import { useSiteContext } from "./Site";

export type Data = {
  label: string;
  links: LinkData[];
};

const IntegratedExploreBar = ({ data }: { data: Data }) => {
  const { countryCode } = useSiteContext();
  const { label, links } = data;
  const { isClient } = useIsClient();
  const memoizedGetClickableActionFromUrl = memoize(getClickableActionFromUrl);

  return (
    <ExploreBar
      heading={label}
      links={links.map(({ label, linkedPage, url, asset }) => ({
        label,
        action: memoizedGetClickableActionFromUrl(
          {
            isSSR: !isClient,
            linkedPage,
            url,
            countryCode,
            assetUrl: asset?.file?.url,
            label
          },
          []
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
