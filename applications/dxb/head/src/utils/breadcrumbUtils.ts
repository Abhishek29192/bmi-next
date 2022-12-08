import { Data as BreadcrumbsData } from "../components/Breadcrumbs";
import { Data, NavigationData, NavigationItem } from "../components/Link";
import { truncate } from "./truncate";

const BREADCRUMB_TITLE_CHARACTERS_LIMIT = 20; // should be 20 characters include ellipsis

export const updateBreadcrumbTitleFromContentful = (
  breadcrumbs: BreadcrumbsData,
  breadcrumbTitle: string
): BreadcrumbsData => {
  if (breadcrumbTitle) {
    breadcrumbs[breadcrumbs.length - 1].label = truncate(
      breadcrumbTitle,
      BREADCRUMB_TITLE_CHARACTERS_LIMIT
    );
  }
  return [...breadcrumbs];
};

export const checkIfActiveLabelInParentNode = (
  label: string,
  menuNavigation: NavigationData = {} as NavigationData
): string => {
  if (!!label && !!menuNavigation.links.length) {
    const parentMenuNode: NavigationData | NavigationItem | Data =
      menuNavigation.links.find((i: NavigationData) => {
        const nestedLinks = i.links || [];
        return (
          nestedLinks.length === 1 &&
          nestedLinks.find((i: NavigationData) => i.label === label)
        );
      });
    return (
      (parentMenuNode &&
        parentMenuNode.__typename !== "ContentfulNavigationItem" &&
        parentMenuNode.label) ||
      ""
    );
  }
  return "";
};
