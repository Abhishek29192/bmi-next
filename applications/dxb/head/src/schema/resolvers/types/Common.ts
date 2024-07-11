export type ParentPage = {
  __typename:
    | "Page"
    | "HomePage"
    | "BrandLandingPage"
    | "ContactUsPage"
    | "DocumentLibraryPage"
    | "ProductListerPage";
  sys: {
    id: string;
  };
  title: string;
  //Slug will be null if the parent page has been selected as a home page
  slug: string | null;
  parentPage: ParentPage | null;
};
