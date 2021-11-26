import { Data as BreadcrumbsData } from "../components/Breadcrumbs";
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
