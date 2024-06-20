import ExploreBar from "@bmi-digital/components/explore-bar";
import { graphql } from "gatsby";
import React from "react";
import { useSiteContext } from "./Site";
import { toButtonActionProps } from "./link/utils";
import type { Data as LinkData } from "./link/types";
import type { ButtonProps } from "@bmi-digital/components/button";

export type Data = {
  label: string;
  links: [LinkData, ...LinkData[]];
};

const IntegratedExploreBar = ({ data }: { data: Data }) => {
  const { countryCode } = useSiteContext();
  const { label, links } = data;

  return (
    <ExploreBar
      heading={label}
      links={
        links.map<ButtonProps>((link) => ({
          children: link.label,
          ...toButtonActionProps(link, countryCode)
        })) as [ButtonProps, ...ButtonProps[]]
      }
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
