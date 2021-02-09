import React, { useContext } from "react";
import Breadcrumbs, { Props as BreadcrumbsProps } from "@bmi/breadcrumbs";
import { graphql } from "gatsby";
import { SiteContext } from "../components/Site";
import { Data as PageInfoData } from "./PageInfo";
import { getClickableActionFromUrl, LinkData, NavigationData } from "./Link";

type Path = {
  label: string;
  link: LinkData | null;
};

export type Data = Pick<PageInfoData, "title" | "slug"> & {
  parentPage: Pick<PageInfoData, "__typename" | "title" | "slug"> | null;
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
    if (!menuNavigation.links?.length) {
      return [];
    }

    let result = path;
    menuNavigation.links.some((item) => {
      if (found) {
        return true;
      }

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
        if (item.link?.linkedPage?.slug === slug) {
          found = true;
          result = path;
          return true;
        }

        result = __helper(item, [
          ...path,
          ...(item.link
            ? [
                {
                  label: item.label,
                  link: item.link
                }
              ]
            : [])
        ]);
      }
    });

    return result;
  };

  const result = __helper(menuNavigation);
  return found ? result : [];
};

const IntegratedBreadcrumbs = ({
  data: { title, slug, parentPage },
  menuNavigation,
  ...rest
}: {
  data: Data;
  menuNavigation?: NavigationData;
} & BreadcrumbsProps) => {
  const path = menuNavigation
    ? findPath(parentPage?.slug || slug, menuNavigation)
    : [];
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
      {parentPage ? (
        <Breadcrumbs.Item
          action={getClickableActionFromUrl(parentPage, null, countryCode)}
        >
          {parentPage.title}
        </Breadcrumbs.Item>
      ) : null}
      <Breadcrumbs.Item>{title}</Breadcrumbs.Item>
    </Breadcrumbs>
  );
};

export default IntegratedBreadcrumbs;

export const query = graphql`
  fragment BreadcrumbsFragment on ContentfulPage {
    title
    slug
    parentPage {
      ... on ContentfulHomePage {
        title
      }
      ... on ContentfulPage {
        title
        slug
      }
    }
  }
`;
