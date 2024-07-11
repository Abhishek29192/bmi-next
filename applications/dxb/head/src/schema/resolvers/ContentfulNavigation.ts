import { NavigationData } from "../../components/link/types";
import { Navigation as ContentfulNavigation } from "./types/Site";
import resolveLink from "./ContentfulLink";
import resolvePromo from "./ContentfulPromo";

const transformLinks = async (
  links: ContentfulNavigation["linksCollection"]["items"]
): Promise<NavigationData["links"]> => {
  const resolvedItems: NavigationData["links"] = [];

  for await (const item of links) {
    if (item.__typename === "NavigationItem") {
      resolvedItems.push(item);
      continue;
    }

    if (item.__typename === "Navigation") {
      const resolvedNavigation = await resolveNavigation(item);
      resolvedItems.push(resolvedNavigation);
      continue;
    }

    const resolvedLink = await resolveLink(item);
    resolvedItems.push(resolvedLink);
  }

  return resolvedItems;
};

const transformPromos = async (
  promos: ContentfulNavigation["promosCollection"]["items"]
): Promise<NavigationData["promos"]> => {
  const resolvedPromos: NavigationData["promos"] = [];
  for await (const promo of promos) {
    const resolvedPromo = await resolvePromo(promo);
    resolvedPromos.push(resolvedPromo);
  }

  return resolvedPromos;
};

const resolveNavigation = async (
  contentfulMenuItem: ContentfulNavigation
): Promise<NavigationData> => {
  const { linksCollection, link, promosCollection, sys, ...rest } =
    contentfulMenuItem;

  return {
    ...rest,
    links: await transformLinks(linksCollection.items),
    promos: promosCollection
      ? await transformPromos(promosCollection.items)
      : null,
    link: link ? await resolveLink(link) : null
  };
};

export default resolveNavigation;
