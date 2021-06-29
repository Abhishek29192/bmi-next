import React from "react";
import { render } from "@testing-library/react";
import { Filter } from "@bmi/filters";
import { LocationProvider } from "@reach/router";
import ProductListerPage from "../../templates/product-lister-page";
import { Data as PageInfoData } from "../../components/PageInfo";
import { Data as PageData } from "../../components/Page";
import { RichTextData } from "../../components/RichText";
import { Data as BreadcrumbsData } from "../../components/Breadcrumbs";
import { Data as LinkData } from "../../components/Link";
import { Data as SiteData } from "../Site";
import { NavigationData } from "../Link";
import createProduct from "../../__tests__/PimDocumentProductHelper";

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulProductListerPage";
    content: RichTextData | null;
    features: string[] | null;
    featuresLink: LinkData | null;
    breadcrumbs: BreadcrumbsData;
  };

const pageInfo: Data = {
  __typename: "ContentfulProductListerPage",
  id: "title",
  title: "i am a title",
  subtitle: null,
  brandLogo: null,
  tags: null,
  date: null,
  featuredMedia: {
    type: null,
    altText: "Lorem ipsum",
    caption: null,
    focalPoint: null,
    image: {
      gatsbyImageData: {
        images: {
          sources: [
            {
              srcSet:
                "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=webp 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=webp 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=webp 948w",
              sizes: "(min-width: 948px) 948px, 100vw",
              type: "image/webp"
            }
          ],
          fallback: {
            src: "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png",
            srcSet:
              "//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=237&h=180&q=50&fm=png 237w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=474&h=360&q=50&fm=png 474w,\n//images.ctfassets.net/18fop5x17y3g/6GSQdvd6U3Gzt6Lh7eNaBR/4d364fe9edaf47c271cdcd6034a7ec28/demo-house.png?w=948&h=720&q=50&fm=png 948w",
            sizes: "(min-width: 948px) 948px, 100vw"
          }
        },
        layout: "constrained",
        backgroundColor: "#484848",
        width: 948,
        height: 720
      },
      resize: {
        src: "//images.asset.jpg"
      },
      file: {
        fileName: "Lorem ipsum",
        url: "//images.asset.jpg"
      }
    }
  },
  breadcrumbs: [
    {
      id: "test",
      label: "test",
      slug: "/test"
    }
  ],
  inputBanner: null,
  seo: null,
  featuredVideo: null,
  slug: "",
  path: "",
  content: null,
  features: ["test"],
  featuresLink: null
};
const mockNavigation: NavigationData = {
  __typename: "ContentfulNavigation",
  label: "Main navigation",
  link: null,
  links: [
    {
      __typename: "ContentfulLink",
      id: "string",
      label: "string",
      icon: null,
      isLabelHidden: false,
      url: "link-to-page",
      linkedPage: null,
      type: "External",
      parameters: null,
      dialogContent: null
    }
  ]
};
const siteData: SiteData = {
  node_locale: "en-US",
  homePage: {
    title: "Home page title"
  },
  countryCode: "uk",
  footerMainNavigation: mockNavigation,
  footerSecondaryNavigation: mockNavigation,
  menuNavigation: mockNavigation,
  menuUtilities: mockNavigation,
  resources: null,
  scriptGOptLoad: null
};

const filters: Filter[] = [
  {
    label: "filter1",
    name: "filter1",
    options: [
      {
        label: "option1",
        value: "option1"
      }
    ]
  }
];

const filtersWithColour: Filter[] = [
  {
    label: "filter1",
    name: "colour",
    options: [
      {
        label: "option1",
        value: "option1"
      }
    ]
  }
];

const pageData = {
  contentfulProductListerPage: pageInfo,
  contentfulSite: siteData,
  productFilters: filters,
  initialProducts: []
};

const pageDataWithColourFilter = {
  contentfulProductListerPage: pageInfo,
  contentfulSite: siteData,
  productFilters: filtersWithColour,
  initialProducts: []
};

describe("ProductListerPage template", () => {
  it("renders basic ProductListerPage", () => {
    const pageContext: any = [];
    const { container } = render(
      <LocationProvider>
        <ProductListerPage data={pageData} pageContext={pageContext} />
      </LocationProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders basic ProductListerPage with initialProducts", () => {
    const pageContext: any = [];
    const prod = createProduct();
    pageData.initialProducts.push(prod);
    const { container } = render(
      <LocationProvider>
        <ProductListerPage data={pageData} pageContext={pageContext} />
      </LocationProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders basic ProductListerPage with colour filter", () => {
    const pageContext: any = [];
    const prod = createProduct();
    pageDataWithColourFilter.initialProducts.push(prod);
    const { container } = render(
      <LocationProvider>
        <ProductListerPage
          data={pageDataWithColourFilter}
          pageContext={pageContext}
        />
      </LocationProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("no search for Gatsby preview", () => {
    process.env.GATSBY_PREVIEW = "test";

    const pageContext: any = [];
    const { container } = render(
      <LocationProvider>
        <ProductListerPage data={pageData} pageContext={pageContext} />
      </LocationProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
