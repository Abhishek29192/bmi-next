import Breadcrumbs, {
  BreadcrumbsProps as BaseProps,
  LastBreadcrumbItemProps,
  LinkedBreadcrumbProps
} from "@bmi-digital/components/breadcrumbs";
import { transformHyphens } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import { graphql } from "gatsby";
import NextLink from "next/link";
import { useMemo } from "react";
import { BreadcrumbItem } from "../types/pim";
import { useConfig, Config } from "../contexts/ConfigProvider";
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
  homePage: Context["homePage"],
  isCountryCodeProhibited: Config["isCountryCodeProhibited"]
): LinkedBreadcrumbProps => {
  const label = transformHyphens(homePage.title);
  const url = isCountryCodeProhibited ? "/" : `/${countryCode}/`;

  return {
    label,
    url,
    gtm: {
      id: "cta-click1",
      action: url,
      label
    }
  };
};

type BreadcrumbParams = {
  data: BreadcrumbProps["data"];
  concatenateUrls: BreadcrumbProps["concatenateUrls"];
  countryCode: Context["countryCode"];
  homePage: Context["homePage"];
  isCountryCodeProhibited: Config["isCountryCodeProhibited"];
};

const getBreadcrumbsItem = (
  props: BreadcrumbParams
): [BaseProps["linkedBreadcrumbItems"], BaseProps["lastBreadcrumbItem"]] => {
  const {
    data,
    concatenateUrls,
    countryCode,
    homePage,
    isCountryCodeProhibited
  } = props;

  const homePageBreadcrumb = getHomePageBreadcrumb(
    countryCode,
    homePage,
    isCountryCodeProhibited
  );

  const lastBreadcrumb: LastBreadcrumbItemProps = {
    label: transformHyphens(data[data.length - 1].label)
  };

  if (data.length === 1) {
    return [[homePageBreadcrumb], lastBreadcrumb];
  }

  if (data.every(({ slug }) => !slug)) {
    return [[homePageBreadcrumb], lastBreadcrumb];
  }

  const middleBreadcrumbs: LinkedBreadcrumbProps[] = data
    .slice(0, -1)
    .filter(({ slug }) => slug)
    .map((item, index, array) => {
      const slug = concatenateUrls
        ? array
            .slice(0, index + 1)
            .map((item) => item.slug)
            .join("/")
        : `${item.slug}`;

      const label = transformHyphens(item.label);
      const url = isCountryCodeProhibited
        ? `/${slug}`
        : `/${countryCode}/${slug}`;

      return {
        label,
        url,
        gtm: {
          id: "cta-click1",
          action: url,
          label
        }
      };
    });

  return [[homePageBreadcrumb, ...middleBreadcrumbs], lastBreadcrumb];
};

const IntegratedBreadcrumbs = ({
  data,
  "data-testid": dataTestId,
  concatenateUrls = true,
  ...rest
}: BreadcrumbProps) => {
  const { countryCode, homePage, getMicroCopy } = useSiteContext();
  const { isCountryCodeProhibited } = useConfig();
  const [breadcrumbsItems, currentBreadcrumb] = useMemo(
    () =>
      getBreadcrumbsItem({
        data,
        concatenateUrls,
        countryCode,
        homePage,
        isCountryCodeProhibited
      }),
    [data, concatenateUrls, countryCode, homePage, isCountryCodeProhibited]
  );

  return (
    <Breadcrumbs
      {...rest}
      linkedBreadcrumbItems={breadcrumbsItems}
      lastBreadcrumbItem={currentBreadcrumb}
      component={NextLink}
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
