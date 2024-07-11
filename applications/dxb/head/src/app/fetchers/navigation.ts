import { unstable_cache } from "next/cache";
import { isDefined } from "@bmi/utils";
import getContentfulData from "../../utils/getContentfulData";
import {
  nestedNavigationItem,
  nestedNavigationItemWithPromo,
  menuNavigationTopLevelQuery
} from "../../schema/queries/menuNavigationQuery";
import resolveNavigation from "../../schema/resolvers/ContentfulNavigation";
import type { Navigation as ContentfulNavigation } from "../../schema/resolvers/types/Site";
import type {
  NavigationItem,
  NavigationData
} from "../../components/link/types";
import type { ContentfulLink } from "../../schema/resolvers/types/Link";

const MAXIMUM_ALLOWED_NAVIGATION_NESTING = 5;

type TopLevelNavigation = Omit<
  ContentfulNavigation,
  "linksCollection" | "promosCollection"
> & {
  linksCollection: {
    items: {
      __typename: "Navigation" | "NavigationItem" | "Link";
      sys: { id: string };
    }[];
  };
};

export const getMenuNavigationData =
  async (): Promise<NavigationData | null> => {
    const contentfulNavigation = await getContentfulMenuNavigation();

    if (!contentfulNavigation) {
      return null;
    }

    return resolveNavigation(contentfulNavigation);
  };

export const getContentfulMenuNavigation = unstable_cache(
  async (): Promise<ContentfulNavigation | undefined> => {
    const data = await getContentfulData<{
      siteCollection: {
        items: [{ menuNavigation: TopLevelNavigation }];
      };
    }>(menuNavigationTopLevelQuery, {
      countryCode: process.env.NEXT_PUBLIC_SPACE_MARKET_CODE
    });

    if (data.errors) {
      throw new Error(JSON.stringify(data.errors));
    }

    const menuNavigation = data.data.siteCollection.items[0].menuNavigation;

    const requests = menuNavigation.linksCollection.items.map((item) =>
      getNestedNavigationItems(item.sys.id, 1)
    );
    const navigationEntries = await Promise.all(requests);

    return {
      ...menuNavigation,
      promosCollection: null,
      linksCollection: {
        items: navigationEntries.filter(isDefined)
      }
    };
  },
  ["contentful-menu-navigation"],
  { revalidate: false }
);

type NestedNavigationItemType =
  | NavigationItem
  | ContentfulLink
  | (TopLevelNavigation & Pick<ContentfulNavigation, "promosCollection">);

const getNestedNavigationItems = async (
  navigationItemId: string,
  nestingLevel: number
): Promise<ContentfulNavigation["linksCollection"]["items"][0] | undefined> => {
  const data = await getContentfulData<{
    entryCollection: {
      items: [NestedNavigationItemType];
    };
  }>(
    nestingLevel === 1 ? nestedNavigationItemWithPromo : nestedNavigationItem,
    {
      navigationItemId
    }
  );

  if (data.errors) {
    throw new Error(JSON.stringify(data.errors));
  }

  const navigationEntry = data.data.entryCollection.items[0];

  if (isNavigationItemOrLink(navigationEntry)) {
    return navigationEntry;
  }

  const requests =
    nestingLevel === MAXIMUM_ALLOWED_NAVIGATION_NESTING
      ? []
      : navigationEntry.linksCollection.items.map(async (item) =>
          getNestedNavigationItems(item.sys.id, nestingLevel + 1)
        );
  const entries = await Promise.all(requests);

  return {
    ...navigationEntry,
    linksCollection: {
      items: entries.filter(isDefined)
    }
  };
};

const isNavigationItemOrLink = (
  item: NestedNavigationItemType
): item is NavigationItem | ContentfulLink =>
  item.__typename === "NavigationItem" || item.__typename === "Link";
