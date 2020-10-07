import React, { useContext } from "react";
import Breadcrumbs, { Props as BreadcrumbsProps } from "@bmi/breadcrumbs";
import { SiteContext } from "../components/Site";

import { getClickableActionFromUrl, LinkData, NavigationData } from "./Link";

type Path = {
  label: string;
  link: LinkData | null;
};

export const findPath = (
  slug: string,
  menuNavigation: NavigationData
): Path[] => {
  let found;

  const __helper = (
    menuNavigation: NavigationData,
    path: Path[] = []
  ): Path[] => {
    let result = path;
    menuNavigation.links.some((item) => {
      if (item.__typename === "ContentfulNavigationItem") {
        return;
      }

      if (
        item.__typename === "ContentfulLink" &&
        item.linkedPage?.slug === slug
      ) {
        found = true;
        result = path;
        return true;
      }

      if (item.__typename === "ContentfulNavigation") {
        result = __helper(item, [
          ...path,
          {
            label: item.label,
            link: item.link
          }
        ]);
      }
    });

    return result;
  };

  const result = __helper(menuNavigation);
  return found ? result : [];
};

const IntegratedBreadcrumbs = ({
  title,
  slug,
  menuNavigation,
  ...rest
}: {
  title: string;
  slug: string;
  menuNavigation: NavigationData;
} & BreadcrumbsProps) => {
  const path = findPath(slug, menuNavigation);
  const { countryCode, homePage } = useContext(SiteContext);

  return (
    <Breadcrumbs {...rest}>
      <Breadcrumbs.Item
        action={getClickableActionFromUrl({ slug: "" }, null, countryCode)}
      >
        {homePage.title}
      </Breadcrumbs.Item>
      {path.map(({ label, link }) => (
        <Breadcrumbs.Item
          key={label}
          action={getClickableActionFromUrl(
            link?.linkedPage,
            link?.url,
            countryCode
          )}
        >
          {label}
        </Breadcrumbs.Item>
      ))}
      <Breadcrumbs.Item>{title}</Breadcrumbs.Item>
    </Breadcrumbs>
  );
};

export default IntegratedBreadcrumbs;
