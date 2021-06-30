export interface CreatePagesOptions {
  siteId: string;
  countryCode: string;
  createPage: <PageContext = any>(options: {
    path: string;
    component: string;
    context: PageContext;
  }) => Promise<void>;
  graphql: <Data = any>(
    query: string
  ) => Promise<{
    errors: any;
    data: Data;
  }>;
}
