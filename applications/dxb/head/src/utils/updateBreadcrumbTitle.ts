import { Data as BreadcrumbsData } from "../components/Breadcrumbs";

export const updateBreadcrumbTitleFromContentfull = (
  breadcrumbs: BreadcrumbsData,
  breadcrumbTitle: string
): BreadcrumbsData => {
  if (breadcrumbTitle) {
    breadcrumbs[breadcrumbs.length - 1].label = breadcrumbTitle;
  }
  return [...breadcrumbs];
};
