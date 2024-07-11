import ExploreBar from "@bmi-digital/components/explore-bar";
import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import React from "react";
import { devLog } from "../utils/devLog";
import { useSiteContext } from "./Site";
import { toButtonActionProps } from "./link/utils";
import type { Data as LinkData } from "./link/types";
import type { ButtonProps } from "@bmi-digital/components/button";

export type Data = {
  __typename: "Navigation";
  label: string | null;
  links: LinkData[];
};

const ExploreBarSection = ({ data }: { data: Data }) => {
  const { countryCode } = useSiteContext();
  const { label } = data;
  // Navigation is being used as the explore bar so bad values need filtering out.
  const links = data.links.filter((link) => {
    if (Object.keys(link).length) {
      return true;
    }
    devLog(
      `Only Links can be used if Navigation is being used as an Section. See Explore Bar labelled "${label}".`
    );
  });

  return (
    <Section data-testid={`explorer-bar-section-${replaceSpaces(label)}`}>
      <ExploreBar
        heading={label}
        links={
          links.map<ButtonProps>((link) => ({
            children: link.label,
            ...toButtonActionProps(link, countryCode)
          })) as [ButtonProps, ...ButtonProps[]]
        }
      />
    </Section>
  );
};

export default ExploreBarSection;
