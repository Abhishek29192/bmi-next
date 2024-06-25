import { Data } from "../../components/Page";

const createPageData = (pageData?: Partial<Data>): Data => ({
  breadcrumbs: null,
  signupBlock: null,
  seo: null,
  path: "page-data-path",
  ...pageData
});

export default createPageData;
