import { Data as BreadcrumbsData } from "../components/Breadcrumbs";
import { Data, NavigationData, NavigationItem } from "../components/link/types";

export const updateBreadcrumbTitleFromContentful = (
  breadcrumbs: BreadcrumbsData,
  breadcrumbTitle: string | null
): BreadcrumbsData => {
  if (breadcrumbTitle) {
    breadcrumbs[breadcrumbs.length - 1].label = breadcrumbTitle;
  }
  return [...breadcrumbs];
};

export const checkIfActiveLabelInParentNode = (
  label?: string,
  menuNavigation: NavigationData = {} as NavigationData
): string => {
  if (!!label && !!menuNavigation.links?.length) {
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
