import React from "react";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor
} from "@testing-library/react";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import * as all from "@bmi/use-dimensions";
import { Filter } from "@bmi/filters";
import ProductListerPage, {
  PageContextType
} from "../components/product-lister-page";
import { Data as PageInfoData } from "../../../components/PageInfo";
import { Data as PageData } from "../../../components/Page";
import { RichTextData } from "../../../components/RichText";
import { Data as BreadcrumbsData } from "../../../components/Breadcrumbs";
import { Data as LinkData, DataTypeEnum } from "../../../components/Link";
import { Data as SiteData } from "../../../components/Site";
import { NavigationData } from "../../../components/Link";
import ProvideStyles from "../../../components/__tests__/utils/StylesProvider";
import * as elasticSearch from "../../../utils/elasticSearch";

window.alert = jest.fn();
type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulProductListerPage";
    content: RichTextData | null;
    features: string[] | null;
    featuresLink: LinkData | null;
    breadcrumbs: BreadcrumbsData;
    breadcrumbTitle: string;
    heroType:
      | "Hierarchy"
      | "Spotlight"
      | "Level 1"
      | "Level 2"
      | "Level 3"
      | null;
    cta: LinkData | null;
  };

const heroTitle = "i am a title";
const pageInfo: Data = {
  __typename: "ContentfulProductListerPage",
  id: "title",
  title: heroTitle,
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
      file: {
        fileName: "Lorem ipsum",
        url: "//images.asset.jpg"
      }
    },
    thumbnail: {
      src: "//images.asset.jpg"
    }
  },
  breadcrumbs: [
    {
      id: "test",
      label: "test",
      slug: "/test"
    }
  ],
  breadcrumbTitle: "",
  inputBanner: null,
  seo: null,
  featuredVideo: null,
  slug: "",
  path: "",
  content: null,
  features: ["test"],
  featuresLink: null,
  heroType: "Spotlight",
  cta: null
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
      type: DataTypeEnum.External,
      parameters: null,
      dialogContent: null,
      hubSpotCTAID: null
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
  scriptGOptLoad: null,
  regions: [
    {
      label: "Europe",
      menu: [
        { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
        { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
        { code: "uk", label: "United Kingdom", icon: "/icons/flags/uk.svg" }
      ]
    }
  ]
};

const pageData = {
  contentfulProductListerPage: pageInfo,
  contentfulSite: siteData,
  productFilters: [],
  plpFilters: [],
  initialProducts: []
};

const pageContext: PageContextType = {
  allowFilterBy: [],
  variantCode: "variant1",
  siteId: "siteId",
  countryCode: "no",
  categoryCodes: ["category-code-1"],
  pimClassificationCatalogueNamespace: "",
  variantCodeToPathMap: {
    variant1: "variant1"
  }
};

const productWithVariantAndBase = {
  code: "test1",
  externalProductCode: "test1",
  name: "imaproduct",
  description: "imadescription",
  documents: [],
  breadcrumbs: null,
  categories: [
    {
      name: "category-code-1",
      categoryType: "Category",
      code: "category-code-1",
      parentCategoryCode: ""
    },
    {
      name: "Bob",
      categoryType: "Category",
      code: "BOB",
      parentCategoryCode: "Root"
    }
  ],
  images: [],
  variantOptions: [
    {
      code: "test1",
      externalProductCode: "test1",
      isSampleOrderAllowed: false,
      approvalStatus: "approved",
      shortDescription: "blah",
      longDescription: "blah blah",
      images: null,
      breadcrumbs: null,
      path: ""
    }
  ],
  baseProduct: {
    code: "test1",
    externalProductCode: "test1",
    name: "imaproduct",
    description: "imadescription",
    documents: [],
    breadcrumbs: null,
    categories: [
      {
        name: "Root",
        categoryType: "Category",
        code: "Root",
        parentCategoryCode: ""
      },
      {
        name: "Bob",
        categoryType: "Category",
        code: "BOB",
        parentCategoryCode: "Root"
      }
    ],
    variantOptions: [
      {
        code: "test1",
        externalProductCode: "test1",
        isSampleOrderAllowed: false,
        approvalStatus: "approved",
        shortDescription: "blah",
        longDescription: "blah blah",
        images: null,
        breadcrumbs: null,
        path: ""
      }
    ]
  }
};

function getDimensionHookFn(width: number): () => all.UseDimensionsHook {
  return () => [() => {}, { width, height: 0 }, document.createElement("div")];
}

function mockUseDimensions({
  containerWidth,
  normalTableWidth,
  mediumTableWidth
}: {
  containerWidth: number;
  normalTableWidth: number;
  mediumTableWidth: number;
}) {
  let spy = jest.spyOn(all, "default");

  // NOTE: component re-renders at most three times in the test for three different size
  for (let i = 0; i < 3; i++) {
    spy = spy
      .mockImplementationOnce(getDimensionHookFn(containerWidth))
      .mockImplementationOnce(getDimensionHookFn(normalTableWidth))
      .mockImplementationOnce(getDimensionHookFn(mediumTableWidth));
  }
}

process.env.GATSBY_USE_LEGACY_FILTERS = "true";
process.env.GATSBY_RECAPTCHA_KEY = "test";
process.env.GATSBY_VISUALISER_ASSETS_URL = "jest-test-page";

const route = "/jest-test-page";
const history = createHistory(createMemorySource(route));

const mockQueryES = jest
  .spyOn(elasticSearch, "queryElasticSearch")
  .mockResolvedValue({
    hits: {
      hits: [productWithVariantAndBase],
      total: {
        value: 1
      }
    }
  });

const renderWithStylesAndLocationProvider = (
  pageData: any,
  pageContext: PageContextType
): RenderResult => {
  return render(
    <ProvideStyles>
      <LocationProvider history={history}>
        <ProductListerPage data={pageData} pageContext={pageContext} />
      </LocationProvider>
    </ProvideStyles>
  );
};

const OLD_ENV = process.env;

afterEach(() => {
  process.env = OLD_ENV; // Restore old environment

  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.resetModules(); // Most important - it clears the cache
  process.env = { ...OLD_ENV }; // Make a copy
  process.env.GATSBY_ENABLE_BRAND_PROVIDER = "true";
  mockUseDimensions({
    containerWidth: 400,
    normalTableWidth: 400,
    mediumTableWidth: 400
  });
});

describe("ProductListerPage template", () => {
  describe("New plpFilters tests", () => {
    beforeEach(() => {
      process.env.GATSBY_USE_LEGACY_FILTERS = "false";
    });

    describe("ProductListerPage without initialProducts without BrandProvider", () => {
      it("renders basic ProductListerPage", async () => {
        process.env.GATSBY_ENABLE_BRAND_PROVIDER = "false";
        pageData.initialProducts = [];
        pageData.plpFilters = [];
        const { container, findByText } = renderWithStylesAndLocationProvider(
          pageData,
          pageContext
        );
        await findByText(heroTitle);
        await waitFor(() => expect(container.parentElement).toMatchSnapshot());
      });
    });

    describe("ProductListerPage without initialProducts", () => {
      it("renders basic ProductListerPage", async () => {
        pageData.initialProducts = [];
        pageData.plpFilters = [];
        const { container, findByText } = renderWithStylesAndLocationProvider(
          pageData,
          pageContext
        );
        await findByText(heroTitle);
        await waitFor(() => expect(container.parentElement).toMatchSnapshot());
      });
    });
    describe("ProductListerPage with multiple category codes", () => {
      describe("And First Category code on first initial product match", () => {
        it("renders category code Section Title", async () => {
          const localPageData = {
            ...pageData,
            initialProducts: [
              {
                ...productWithVariantAndBase,
                categories: [
                  {
                    name: "category-code-2",
                    categoryType: "Category",
                    code: "category-code-2",
                    parentCategoryCode: ""
                  }
                ]
              }
            ],
            plpFilters: []
          };
          const localPageContext: PageContextType = {
            allowFilterBy: [],
            variantCode: "variant1",
            siteId: "siteId",
            countryCode: "no",
            categoryCodes: ["category-code-2", "category-code-1"],
            pimClassificationCatalogueNamespace: "",
            variantCodeToPathMap: {
              variant1: "variant1"
            }
          };

          const { container, findByText } = renderWithStylesAndLocationProvider(
            localPageData,
            localPageContext
          );
          await findByText("category-code-2");
          await waitFor(() =>
            expect(container.parentElement).toMatchSnapshot()
          );
        });
      });

      describe("And First Category code on first initial product does NOT match", () => {
        it("then, Renders category code Section Title", async () => {
          const localPageData = {
            ...pageData,
            initialProducts: [
              {
                ...productWithVariantAndBase,
                categories: [
                  {
                    name: "category-code-3",
                    categoryType: "Category",
                    code: "category-code-3",
                    parentCategoryCode: ""
                  }
                ]
              }
            ],
            plpFilters: []
          };
          const localPageContext = {
            allowFilterBy: [],
            variantCode: "variant1",
            siteId: "siteId",
            countryCode: "no",
            categoryCodes: ["category-code-2", "category-code-1"],
            pimClassificationCatalogueNamespace: "",
            variantCodeToPathMap: {
              variant1: "variant1"
            }
          };
          const { container, findByText, queryByText } =
            renderWithStylesAndLocationProvider(
              localPageData,
              localPageContext
            );
          await findByText(heroTitle);
          const categoryLabel = queryByText("category-code-2");
          expect(categoryLabel).toBeNull();

          const categoryLabel3 = queryByText("category-code-3");
          expect(categoryLabel3).toBeNull();
          expect(container.parentElement).toMatchSnapshot();
        });
      });
    });

    describe("When level 1 hero selected", () => {
      it("renders hero correctly", async () => {
        pageData.initialProducts = [productWithVariantAndBase];
        pageData.contentfulProductListerPage.heroType = "Level 1";

        const { container } = renderWithStylesAndLocationProvider(
          pageData,
          pageContext
        );
        await waitFor(() =>
          expect(container.getElementsByClassName("Hero--lvl-1").length).toBe(1)
        );
        await waitFor(() => expect(container.parentElement).toMatchSnapshot());
      });
    });

    describe("ProductListerPage with product filters", () => {
      describe("When Colour filters are provided", () => {
        it("renders FiltersSidebar with color option with color Swatches", async () => {
          const color1Label = "colour-1";
          const color2Label = "colour-2";

          const productFilters: Filter[] = [
            {
              name: "colour",
              label: "Colour",
              options: [
                { label: color1Label, value: "colour1" },
                { label: color2Label, value: "colour2" }
              ]
            }
          ];
          pageData.initialProducts = [productWithVariantAndBase];
          pageData.plpFilters = productFilters;
          const { container, getByLabelText, queryByText } =
            renderWithStylesAndLocationProvider(pageData, pageContext);
          await getByLabelText(color1Label);
          expect(queryByText(color2Label)).not.toBeNull();
          expect(container.parentElement).toMatchSnapshot();
        });
      });

      describe("When level 1 hero selected", () => {
        it("renders hero correctly", async () => {
          pageData.initialProducts = [productWithVariantAndBase];
          pageData.contentfulProductListerPage.heroType = "Level 1";

          const { container } = renderWithStylesAndLocationProvider(
            pageData,
            pageContext
          );
          await waitFor(() =>
            expect(container.getElementsByClassName("Hero--lvl-1").length).toBe(
              1
            )
          );
          await waitFor(() =>
            expect(container.parentElement).toMatchSnapshot()
          );
        });
      });

      describe("When Other filters are provided", () => {
        it("renders FiltersSidebar with filter option checkboxes", async () => {
          const size1Label = "Size-1";
          const size2Label = "Size-2";

          const productFilters: Filter[] = [
            {
              name: "size",
              label: "Size",
              options: [
                { label: size1Label, value: "10mm" },
                { label: size2Label, value: "20mm" }
              ]
            }
          ];
          pageData.initialProducts = [productWithVariantAndBase];
          pageData.plpFilters = productFilters;
          const { container, getByLabelText, queryByText } =
            renderWithStylesAndLocationProvider(pageData, pageContext);
          await getByLabelText(size1Label);
          expect(queryByText(size2Label)).not.toBeNull();
          expect(container.parentElement).toMatchSnapshot();
        });
      });
    });
  });

  //TODO: remove these tests when `GATSBY_USE_LEGACY_FILTERS` flag is removed
  // JIRA : https://bmigroup.atlassian.net/browse/DXB-2789
  describe("ProductListerPage Legacy ProductFilters tests", () => {
    describe("ProductListerPage without initialProducts without BrandProvider", () => {
      it("renders basic ProductListerPage", async () => {
        process.env.GATSBY_ENABLE_BRAND_PROVIDER = "false";
        pageData.initialProducts = [];
        pageData.productFilters = [];
        const { container, findByText } = renderWithStylesAndLocationProvider(
          pageData,
          pageContext
        );
        await findByText(heroTitle);
        await waitFor(() => expect(container.parentElement).toMatchSnapshot());
      });
    });
    describe("ProductListerPage without initialProducts", () => {
      it("renders basic ProductListerPage", async () => {
        pageData.initialProducts = [];
        pageData.productFilters = [];
        const { container, findByText } = renderWithStylesAndLocationProvider(
          pageData,
          pageContext
        );
        await findByText(heroTitle);
        await waitFor(() => expect(container.parentElement).toMatchSnapshot());
      });
    });

    describe("ProductListerPage with multiple category codes", () => {
      describe("And First Category code on first initial product match", () => {
        it("then, Renders category code Section Title", async () => {
          const localPageData = {
            ...pageData,
            initialProducts: [
              {
                ...productWithVariantAndBase,
                categories: [
                  {
                    name: "category-code-2",
                    categoryType: "Category",
                    code: "category-code-2",
                    parentCategoryCode: ""
                  }
                ]
              }
            ],
            plpFilters: []
          };
          const localPageContext: PageContextType = {
            allowFilterBy: [],
            variantCode: "variant1",
            siteId: "siteId",
            countryCode: "no",
            categoryCodes: ["category-code-2", "category-code-1"],
            pimClassificationCatalogueNamespace: "",
            variantCodeToPathMap: {
              variant1: "variant1"
            }
          };

          const { container, findByText } = renderWithStylesAndLocationProvider(
            localPageData,
            localPageContext
          );
          await findByText("category-code-2");
          await waitFor(() =>
            expect(container.parentElement).toMatchSnapshot()
          );
        });
      });

      describe("And First Category code on first initial product does NOT match", () => {
        it("then, Renders category code Section Title", async () => {
          const localPageData = {
            ...pageData,
            initialProducts: [
              {
                ...productWithVariantAndBase,
                categories: [
                  {
                    name: "category-code-3",
                    categoryType: "Category",
                    code: "category-code-3",
                    parentCategoryCode: ""
                  }
                ]
              }
            ],
            plpFilters: []
          };
          const localPageContext = {
            allowFilterBy: [],
            variantCode: "variant1",
            siteId: "siteId",
            countryCode: "no",
            categoryCodes: ["category-code-2", "category-code-1"],
            pimClassificationCatalogueNamespace: "",
            variantCodeToPathMap: {
              variant1: "variant1"
            }
          };
          const { container, findByText, queryByText } =
            renderWithStylesAndLocationProvider(
              localPageData,
              localPageContext
            );
          await findByText(heroTitle);
          const categoryLabel = queryByText("category-code-2");
          expect(categoryLabel).toBeNull();

          const categoryLabel3 = queryByText("category-code-3");
          expect(categoryLabel3).toBeNull();
          expect(container.parentElement).toMatchSnapshot();
        });
      });
    });

    describe("ProductListerPage with initialProducts", () => {
      it("renders matching category code of product on Section Title", async () => {
        pageData.initialProducts = [productWithVariantAndBase];
        pageData.productFilters = [];
        const { container, findByText } = renderWithStylesAndLocationProvider(
          pageData,
          pageContext
        );
        await findByText("category-code-1");
        expect(container.parentElement).toMatchSnapshot();
      });
    });

    describe("ProductListerPage with product filters", () => {
      describe("When Colour filters are provided", () => {
        it("renders FiltersSidebar with color option with color Swatches", async () => {
          const color1Label = "colour-1";
          const color2Label = "colour-2";

          const productFilters: Filter[] = [
            {
              name: "verycolourfamily",
              label: "Colour",
              options: [
                { label: color1Label, value: "colour1" },
                { label: color2Label, value: "colour2" }
              ]
            }
          ];
          pageData.initialProducts = [productWithVariantAndBase];
          pageData.productFilters = productFilters;
          const { container, getByLabelText, queryByText } =
            renderWithStylesAndLocationProvider(pageData, pageContext);
          await getByLabelText(color1Label);
          expect(queryByText(color2Label)).not.toBeNull();
          expect(container.parentElement).toMatchSnapshot();
        });
      });

      describe("When level 1 hero selected", () => {
        it("renders renders hero correctly", async () => {
          pageData.initialProducts = [productWithVariantAndBase];
          pageData.contentfulProductListerPage.heroType = "Level 1";

          const { container } = renderWithStylesAndLocationProvider(
            pageData,
            pageContext
          );
          await waitFor(() =>
            expect(container.getElementsByClassName("Hero--lvl-1").length).toBe(
              1
            )
          );
          await waitFor(() =>
            expect(container.parentElement).toMatchSnapshot()
          );
        });
      });

      describe("When Other filters are provided", () => {
        it("renders FiltersSidebar with filter option checkboxes", async () => {
          const size1Label = "Size-1";
          const size2Label = "Size-2";

          const productFilters: Filter[] = [
            {
              name: "size",
              label: "Size",
              options: [
                { label: size1Label, value: "10mm" },
                { label: size2Label, value: "20mm" }
              ]
            }
          ];
          pageData.initialProducts = [productWithVariantAndBase];
          pageData.productFilters = productFilters;
          const { container, getByLabelText, queryByText } =
            renderWithStylesAndLocationProvider(pageData, pageContext);
          await getByLabelText(size1Label);
          expect(queryByText(size2Label)).not.toBeNull();
          expect(container.parentElement).toMatchSnapshot();
        });
      });
    });
  });

  it("no search for Gatsby preview", async () => {
    process.env.GATSBY_PREVIEW = "test";
    pageData.initialProducts = [productWithVariantAndBase];
    pageData.productFilters = [];
    const { container, findByText } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    await findByText(heroTitle);
    expect(container.parentElement).toMatchSnapshot();
  });

  it("test hande change by click on pagination", async () => {
    const products = new Array(30).fill(productWithVariantAndBase);
    pageData.initialProducts = [...products];
    jest.spyOn(window, "scrollTo").mockImplementation();
    const { getByLabelText } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    fireEvent.click(getByLabelText("Go to next page"));
    expect(window.scrollTo).toHaveBeenCalledWith(0, -200);
  });

  it("test hande fetch product by click on pagination when ES return hits", async () => {
    const esProduct = {
      _index: "dxb_no_products",
      _type: "_doc",
      _id: "133000133_Zanda_Arktis_main_tile_black",
      _score: 6.0,
      _source: {
        "appearanceAttributes.colour": [
          {
            code: "Svart",
            name: "Svart"
          }
        ],
        "appearanceAttributes.colourfamily": [
          {
            code: "BLACK",
            name: "Sort"
          }
        ],
        categories: [
          {
            parentCategoryCode: "CONCRETE_NO",
            code: "MAINTILE_CONCRETE_NO"
          },
          {
            parentCategoryCode: "TILES_STEELROOF_NO",
            code: "MAINTILE_STEELROOF_NO"
          }
        ]
      },
      inner_hits: {
        all_variants: {
          hits: {
            hits: []
          }
        }
      }
    };
    const products = new Array(30).fill(productWithVariantAndBase);
    const esProducts = new Array(30).fill(esProduct);
    pageData.initialProducts = [...products];
    mockQueryES.mockResolvedValueOnce({
      hits: {
        hits: [...esProducts],
        total: {
          value: 1
        }
      },
      aggregations: {
        unique_base_products_count: {
          value: 30
        }
      }
    });
    const { container, getByLabelText } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    fireEvent.click(getByLabelText("Go to next page"));
    expect(mockQueryES).toBeCalledTimes(1);
    expect(container.parentElement).toMatchSnapshot();
  });

  it("test hande fetch product by click on pagination when ES return aggregations", async () => {
    const products = new Array(30).fill(productWithVariantAndBase);
    pageData.initialProducts = [...products];
    mockQueryES.mockResolvedValueOnce({
      aggregations: {
        texturefamily: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: "GLAZED",
              doc_count: 139
            },
            {
              key: "ANTIQUED",
              doc_count: 1
            }
          ]
        }
      }
    });
    const { container, getByLabelText } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    fireEvent.click(getByLabelText("Go to next page"));
    expect(mockQueryES).toBeCalledTimes(1);
    expect(container.parentElement).toMatchSnapshot();
  });

  it("test hande change url by click on filters and test clear all click", async () => {
    window.history.replaceState = jest.fn();
    const color1Label = "colour-1";
    const color2Label = "colour-2";
    const productFilters: Filter[] = [
      {
        name: "colour",
        label: "Colour",
        options: [
          { label: color1Label, value: "colour1" },
          { label: color2Label, value: "colour2" }
        ]
      }
    ];
    pageData.initialProducts = [
      {
        ...productWithVariantAndBase,
        all_variants: [
          { ...productWithVariantAndBase },
          { ...productWithVariantAndBase }
        ]
      }
    ];
    pageData.productFilters = productFilters;
    const { container, queryByText, getByText } =
      renderWithStylesAndLocationProvider(pageData, pageContext);
    expect(container.parentElement).toMatchSnapshot();
    fireEvent.click(queryByText(color2Label));
    expect(window.history.replaceState).toHaveBeenCalledTimes(1);
    fireEvent.click(getByText("MC: plp.filters.clearAll"));
    expect(window.history.replaceState).toHaveBeenCalledTimes(2);
  });

  it("test filter resolver utils when it is not a colour name", async () => {
    const texture1Label = "texture-1";
    const texture2Label = "texture-2";

    const productFilters: Filter[] = [
      {
        name: "texturefamily",
        label: "texture",
        options: [
          { label: texture1Label, value: "texture1" },
          { label: texture2Label, value: "texture2" }
        ]
      }
    ];
    pageData.initialProducts = [productWithVariantAndBase];
    pageData.productFilters = productFilters;
    const { container } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("test filter resolver utils when no filters at all", async () => {
    pageData.initialProducts = [productWithVariantAndBase];
    pageData.productFilters = null;
    const { container } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it("should prevent fetch products on GATSBY_PREVIEW", async () => {
    process.env.GATSBY_PREVIEW = "GATSBY_PREVIEW";
    jest.spyOn(window, "alert").mockImplementation();
    const products = new Array(30).fill(productWithVariantAndBase);
    pageData.initialProducts = [...products];
    const { getByLabelText } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    fireEvent.click(getByLabelText("Go to next page"));

    expect(window.alert).toHaveBeenCalledWith(
      "You cannot search on the preview environment."
    );
  });
});
