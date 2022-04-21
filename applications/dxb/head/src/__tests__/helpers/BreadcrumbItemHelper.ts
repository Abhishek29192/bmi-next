import { BreadcrumbItem } from "../../types/pim";

const createBreadcrumbItem = (
  breadcrumbItem?: Partial<BreadcrumbItem>
): BreadcrumbItem => ({
  id: "id",
  label: "label",
  slug: "slug",
  ...breadcrumbItem
});

export default createBreadcrumbItem;
