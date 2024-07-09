import { Data } from "../../templates/simplePage/components/simple-page";
import createBreadcrumbItem from "./BreadcrumbItemHelper";
import createPageData from "./PageHelper";
import createPageInfoData from "./PageInfoHelper";

const createSimplePageData = (simplePage?: Partial<Data>): Data => ({
  ...createPageInfoData(),
  ...createPageData(),
  __typename: "ContentfulSimplePage",
  leadBlock: null,
  shareWidget: null,
  sections: null,
  nextBestActions: null,
  exploreBar: null,
  linkColumns: null,
  heroType: null,
  parentPage: null,
  breadcrumbs: [createBreadcrumbItem()],
  breadcrumbTitle: "example-breadcrumb-title",
  cta: null,
  ...simplePage
});

export default createSimplePageData;