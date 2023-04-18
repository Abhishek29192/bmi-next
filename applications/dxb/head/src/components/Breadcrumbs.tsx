import {
  Breadcrumbs,
  BreadcrumbsProps,
  replaceSpaces
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
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

  const currentBreadcrumb = breadcrumbsItems[breadcrumbsItems.length - 1];
  const existingBreadcrumbsItems = breadcrumbsItems.slice(
    0,
    breadcrumbsItems.length - 1
  );
  return [existingBreadcrumbsItems, currentBreadcrumb];
};

const IntegratedBreadcrumbs = ({
  data,
  "data-testid": dataTestId,
  ...rest
}: {
  data: Data;
} & BreadcrumbsProps & {
    "data-testid"?: string;
  }) => {
  const { countryCode, homePage } = useSiteContext();
  const [breadcrumbsItems, currentBreadcrumb] = getBreadcrumbsItem(data);

  return (
    <Breadcrumbs
      {...rest}
      data-testid={dataTestId ? dataTestId : "breadcrumbs"}
    >
      <Breadcrumbs.Item
        action={getClickableActionFromUrl(
          { path: "" },
          null,
          countryCode,
          undefined,
          homePage.title
        )}
        data-testid={`breadcrumb-${replaceSpaces(homePage.title)}`}
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
            undefined,
            label
          )}
          data-testid={`breadcrumb-${replaceSpaces(label)}`}
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
