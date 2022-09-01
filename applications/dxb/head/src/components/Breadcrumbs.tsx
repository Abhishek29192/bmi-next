import React from "react";
import { graphql } from "gatsby";
import { Breadcrumbs, BreadcrumbsProps } from "@bmi/components";
import { BreadcrumbItem } from "../types/pim";
import { getClickableActionFromUrl } from "./Link";
import { useSiteContext } from "./Site";

export type Data = BreadcrumbItem[];

const getBreadcrumbsItem = (
  items: BreadcrumbItem[]
): [BreadcrumbItem[], BreadcrumbItem] => {
  if (items.length === 1) {
    return [[], items[0]];
  }

  const breadcrumbsItems = [...items]
    .filter(({ slug }) => slug)
    .map((item, index, array) => {
      const breadcrumbItem: BreadcrumbItem = {
        id: item.id,
        label: item.label,
        slug:
          index !== array.length - 1
            ? array
                .slice(0, index + 1)
                .map(({ slug }) => slug)
                .join("/")
                .concat("/")
            : null
      };

      return breadcrumbItem;
    });
  const currentBreadcrumb = breadcrumbsItems.pop();

  return [breadcrumbsItems, currentBreadcrumb];
};

const IntegratedBreadcrumbs = ({
  data,
  ...rest
}: {
  data: Data;
} & BreadcrumbsProps) => {
  const { countryCode, homePage } = useSiteContext();
  const [breadcrumbsItems, currentBreadcrumb] = getBreadcrumbsItem(data);

  return (
    <Breadcrumbs {...rest}>
      <Breadcrumbs.Item
        action={getClickableActionFromUrl(
          { path: "" },
          null,
          countryCode,
          null,
          homePage.title
        )}
      >
        {homePage.title}
      </Breadcrumbs.Item>
      {breadcrumbsItems.map(({ label, slug }) => (
        <Breadcrumbs.Item
          key={label}
          action={getClickableActionFromUrl(
            { path: slug },
            null,
            countryCode,
            null,
            label
          )}
        >
          {label}
        </Breadcrumbs.Item>
      ))}
      <Breadcrumbs.Item>{currentBreadcrumb.label}</Breadcrumbs.Item>
    </Breadcrumbs>
  );
};

export default IntegratedBreadcrumbs;

export const query = graphql`
  fragment BreadcrumbsFragment on ContentfulPage {
    breadcrumbs {
      ...BreadcrumbItemFragment
    }
    breadcrumbTitle
  }

  fragment BreadcrumbItemFragment on BreadcrumbItem {
    id
    label
    slug
  }
`;
