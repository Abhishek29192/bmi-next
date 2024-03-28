import Breadcrumbs, {
  BreadcrumbsProps
} from "@bmi-digital/components/breadcrumbs";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { graphql } from "gatsby";
import React, { useMemo } from "react";
import { BreadcrumbItem } from "../types/pim";
import { getClickableActionFromUrl } from "./Link";
import { useSiteContext } from "./Site";

export type Data = BreadcrumbItem[];

const getBreadcrumbsItem = (
  items: BreadcrumbItem[],
  concatenateUrls: boolean
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
            ? getBreadcrumbSlug(array, index, concatenateUrls)
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

const getBreadcrumbSlug = (
  items: BreadcrumbItem[],
  index: number,
  concatenateUrls: boolean
) =>
  concatenateUrls
    ? items
        .slice(0, index + 1)
        .map(({ slug }) => slug)
        .join("/")
        .concat("/")
    : // eslint-disable-next-line security/detect-object-injection
      items[index].slug;

const IntegratedBreadcrumbs = ({
  data,
  "data-testid": dataTestId,
  concatenateUrls = true,
  ...rest
}: {
  data: Data;
} & BreadcrumbsProps & {
    concatenateUrls?: boolean;
    "data-testid"?: string;
  }) => {
  const { countryCode, homePage } = useSiteContext();
  const [breadcrumbsItems, currentBreadcrumb] = useMemo(
    () => getBreadcrumbsItem(data, concatenateUrls),
    [data, concatenateUrls]
  );

  return (
    <Breadcrumbs
      {...rest}
      data-testid={dataTestId ? dataTestId : "breadcrumbs"}
    >
      <Breadcrumbs.Item
        action={getClickableActionFromUrl({
          linkedPage: { path: "" },
          countryCode,
          label: homePage.title
        })}
        data-testid={`breadcrumb-${replaceSpaces(homePage.title)}`}
      >
        {homePage.title}
      </Breadcrumbs.Item>
      {breadcrumbsItems.map(({ label, slug }) => (
        <Breadcrumbs.Item
          key={label}
          action={getClickableActionFromUrl({
            linkedPage: { path: slug },
            countryCode,
            label
          })}
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
