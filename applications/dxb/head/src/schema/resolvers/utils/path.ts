import getContentfulData from "../../../utils/getContentfulData";
import parentPageQuery from "../../queries/parentPageQuery";
import { getContentfulMenuNavigation } from "../../../app/fetchers/navigation";
import { NavigationItem } from "../../../components/link/types";
import type { ParentPage } from "../types/Common";
import type { ContentfulLink } from "../types/Link";
import type { Navigation as ContentfulNavigation } from "../types/Site";

export type Path = {
  id?: string;
  path?: string;
  label?: string;
  queryParams?: string;
  slug?: string;
}[];

export type Page = {
  title: string;
  slug: string;
  sys: { id: string };
  parentPage: ParentPage | null;
};

export const getUrlFromPath = (path: Path) => {
  const queryParams = path
    .filter(({ queryParams }) => queryParams)
    .map(({ queryParams }) => queryParams?.replace("?", ""))
    .join("&");

  const finalUrl = path
    .filter(({ slug }) => slug)
    .map(({ slug }) => slug)
    .join("/")
    .concat("/")
    .replace(/\/+/gi, "/")
    .replace("*", "")
    .replace('"', "");

  return queryParams !== "" ? `${finalUrl}?${queryParams}` : finalUrl;
};

const getPath = async (page: Page): Promise<Path> => {
  const menuNavigation = await getContentfulMenuNavigation();

  if (!menuNavigation?.linksCollection.items.length) {
    return [];
  }

  const __getItemFromLink = async (link: ContentfulLink) => {
    if (!link?.linkedPage) {
      return null;
    }

    const { sys, slug, title } = link.linkedPage;

    return {
      id: sys.id,
      slug,
      label: link.label || title,
      queryParams: link.queryParams || ""
    };
  };

  const pageIdToPathMap: Record<string, Path> = {};

  const __helper = async (
    items: (ContentfulLink | ContentfulNavigation | NavigationItem)[],
    path: Path
  ) => {
    if (pageIdToPathMap[page.sys.id]) {
      return pageIdToPathMap[page.sys.id];
    }

    for (const item of items) {
      if (item.__typename === "Link") {
        const pathItem = await __getItemFromLink(item);

        if (pathItem && pathItem.id === page.sys.id) {
          pageIdToPathMap[page.sys.id] = path.concat(pathItem);

          return pageIdToPathMap[page.sys.id];
        }
      }

      if (item.__typename === "Navigation") {
        const pathItem = item.link
          ? await __getItemFromLink(item.link)
          : undefined;

        if (pathItem && pathItem.id === page.sys.id) {
          pageIdToPathMap[page.sys.id] = path.concat(pathItem);
          return pageIdToPathMap[page.sys.id];
        }

        await __helper(
          item.linksCollection.items,
          path.concat(pathItem || { id: item.sys.id, label: item.label || "" })
        );
      }
    }
  };

  await __helper(menuNavigation.linksCollection.items, []);

  return pageIdToPathMap[page.sys.id] || [];
};

type ParentPageResponse = {
  entryCollection: {
    items: [ParentPage];
  };
};

export const resolvePath = async (currentPage: Page): Promise<Path> => {
  const {
    sys: { id },
    title: label,
    slug,
    parentPage
  } = currentPage;
  if (parentPage) {
    const data = await getContentfulData<ParentPageResponse>(parentPageQuery, {
      entryId: parentPage.sys.id
    });

    if (data.errors) {
      throw new Error(JSON.stringify(data.errors));
    }

    const page = data.data.entryCollection.items[0];

    if (!page) {
      return [{ id, label, slug }];
    }

    const path = await resolvePath({ ...page, slug: page.slug || "" });
    const pageItem = { id, label, slug };

    if (!path || !path.length) {
      return [
        {
          id: page.sys.id,
          label: page.title,
          slug: page.slug || ""
        },
        pageItem
      ];
    }

    return [...path, pageItem];
  }

  const path = await getPath(currentPage);

  if (!path || !path.length) {
    return [{ id, label, slug }];
  }

  return path;
};
