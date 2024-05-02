import Breadcrumbs, {
  BreadcrumbsProps as BaseProps,
  LastBreadcrumbItemProps,
  LinkedBreadcrumbProps
} from "@bmi-digital/components/breadcrumbs";
import { transformHyphens } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import { Link, graphql } from "gatsby";
import React, { useMemo } from "react";
import { BreadcrumbItem } from "../types/pim";
import { getPathWithCountryCode } from "../utils/path";
import { Context, useSiteContext } from "./Site";

export type Data = BreadcrumbItem[];

type BreadcrumbProps = Omit<
  BaseProps,
  "linkedBreadcrumbItems" | "lastBreadcrumbItem"
> & {
  data: Data;
  concatenateUrls?: boolean;
  "data-testid"?: string;
};

const getHomePageBreadcrumb = (
  countryCode: Context["countryCode"],
  homePage: Context["homePage"]
): LinkedBreadcrumbProps => {
  return {
    label: transformHyphens(homePage.title),
    url: `/${countryCode}/`,
    gtm: {
      id: "cta-click1",
      action: `/${countryCode}/`,
      label: transformHyphens(homePage.title)
    }
  };
};

type BreadcrumbParams = {
  data: BreadcrumbProps["data"];
  concatenateUrls: BreadcrumbProps["concatenateUrls"];
  countryCode: Context["countryCode"];
  homePage: Context["homePage"];
};

const getBreadcrumbsItem = (
  props: BreadcrumbParams
): [BaseProps["linkedBreadcrumbItems"], BaseProps["lastBreadcrumbItem"]] => {
  const { data, concatenateUrls, countryCode, homePage } = props;
  const homePageBreadcrumb = getHomePageBreadcrumb(countryCode, homePage);

  const middleBreadcrumbs: LinkedBreadcrumbProps[] = data
    .slice(0, -1)
    .filter(({ slug }) => slug)
    .map((item, index, array) => ({
      label: transformHyphens(item.label),
      url: `/${countryCode}/${getBreadcrumbSlug(
        array,
        index,
        concatenateUrls
      )}`,
      gtm: {
        id: "cta-click1",
        action: getPathWithCountryCode(countryCode, item.slug),
        label: transformHyphens(item.label)
      }
    }));

  const lastBreadcrumb: LastBreadcrumbItemProps = {
    label: transformHyphens(data[data.length - 1].label)
  };

  return [[homePageBreadcrumb, ...middleBreadcrumbs], lastBreadcrumb];
};

const getBreadcrumbSlug = (
  items: BreadcrumbProps["data"],
  index: number,
  concatenateUrls: BreadcrumbProps["concatenateUrls"]
) =>
  concatenateUrls
    ? `${items.map(({ slug }) => slug).join("/")}/`
    : // eslint-disable-next-line security/detect-object-injection
      `${items[index].slug}/`;

const IntegratedBreadcrumbs = ({
  data,
  "data-testid": dataTestId,
  concatenateUrls = true,
  ...rest
}: BreadcrumbProps) => {
  const { countryCode, homePage, getMicroCopy } = useSiteContext();
  const [breadcrumbsItems, currentBreadcrumb] = useMemo(
    () => getBreadcrumbsItem({ data, concatenateUrls, countryCode, homePage }),
    [data, concatenateUrls, countryCode, homePage]
  );

  return (
    <Breadcrumbs
      {...rest}
      linkedBreadcrumbItems={breadcrumbsItems}
      lastBreadcrumbItem={currentBreadcrumb}
      component={Link}
      data-testid={dataTestId}
      expandText={getMicroCopy(microCopy.GLOBAL_SHOW_MORE)}
    />
  );
};

export default IntegratedBreadcrumbs;

export const query = graphql`
  fragment BreadcrumbsFragment on ContentfulPage {
    breadcrumbs {
      ...BreadcrumbItemFragment
    }
  }
  fragment BreadcrumbItemFragment on BreadcrumbItem {
    id
    label
    slug
  }
`;
