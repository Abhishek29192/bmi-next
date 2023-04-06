import { Filter, RegionCode, ThemeProvider } from "@bmi-digital/components";
import * as all from "@bmi-digital/use-dimensions";
import { createProduct as createESProduct } from "@bmi/elasticsearch-types";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor
} from "@testing-library/react";
import React from "react";
import type { Product as ESProduct } from "@bmi/elasticsearch-types";
import { DataTypeEnum, NavigationData } from "../../../../components/Link";
import { Data as SiteData } from "../../../../components/Site";
import { Config, ConfigProvider } from "../../../../contexts/ConfigProvider";
import createImageData from "../../../../__tests__/helpers/ImageDataHelper";
import ProductListerPage, {
  Data as PlpPageInfoData,
  PageContextType,
  Props
} from "../product-lister-page";

window.alert = jest.fn();

const heroTitle = "i am a title";
const pageInfo: PlpPageInfoData = {
  __typename: "ContentfulProductListerPage",
  id: "title",
  title: heroTitle,
  subtitle: null,
  brandLogo: null,
  tags: null,
  date: null,
  featuredMedia: createImageData(),
  breadcrumbs: [
    {
      id: "test",
      label: "test",
      slug: "/test"
    }
  ],
  breadcrumbTitle: "",
  signupBlock: null,
  seo: null,
  featuredVideo: null,
  slug: "",
  path: "",
  content: null,
  features: ["test"],
  featuresLink: null,
  heroType: "Spotlight",
  cta: null,
  allowFilterBy: []
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
  pitchedRoofCalculatorConfig: null,
  visualiserHouseTypes: null,
  regions: [
    {
      label: "Europe",
      regionCode: RegionCode.Europe,
      menu: [
        { code: "al", label: "Albania", icon: "/icons/flags/al.svg" },
        { code: "at", label: "Österreich", icon: "/icons/flags/at.svg" },
        { code: "uk", label: "United Kingdom", icon: "/icons/flags/uk.svg" }
      ]
    }
  ]
};

const pageData: Props["data"] = {
  contentfulProductListerPage: pageInfo,
  contentfulSite: siteData,
  plpFilters: { filters: [], allowFilterBy: ["test"] },
  initialProducts: []
};

const pageContext: PageContextType = {
  allowFilterBy: [],
  variantCode: "variant1",
  siteId: "siteId",
  countryCode: "no",
  categoryCodes: ["category-code-1"],
  variantCodeToPathMap: {
    variant1: "variant1"
  }
};

const productWithVariantAndBase: ESProduct = createESProduct();

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

const route = "/jest-test-page";
const history = createHistory(createMemorySource(route));

const mockQueryES = jest.fn();
jest.mock("../../../../utils/elasticSearch", () => {
  const actualElasticSearch = jest.requireActual(
    "../../../../utils/elasticSearch"
  );
  return {
    ...actualElasticSearch,
    queryElasticSearch: (...args) => mockQueryES(...args)
  };
});

const renderWithStylesAndLocationProvider = (
  pageData: Props["data"],
  pageContext: PageContextType,
  mockEnvVariables?: Partial<Config>
): RenderResult => {
  const defaultPageEnvVars = {
    gatsbyReCaptchaKey: "test",
    visualizerAssetUrl: "est-test-page",
    isBrandProviderEnabled: true
  } as Partial<Config>;

  return render(
    <ThemeProvider>
      <ConfigProvider
        configOverride={{ ...defaultPageEnvVars, ...mockEnvVariables }}
      >
        <LocationProvider history={history}>
          <ProductListerPage data={pageData} pageContext={pageContext} />
        </LocationProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
};

afterEach(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.resetModules();
  mockUseDimensions({
    containerWidth: 400,
    normalTableWidth: 400,
    mediumTableWidth: 400
  });
});

describe("ProductListerPage template", () => {
  describe("New plpFilters tests", () => {
    describe("ProductListerPage without initialProducts without BrandProvider", () => {
      it("renders basic ProductListerPage", async () => {
        pageData.initialProducts = [];
        pageData.plpFilters.filters = [];
        const { baseElement } = renderWithStylesAndLocationProvider(
          pageData,
          pageContext,
          { isBrandProviderEnabled: false, isLegacyFiltersUsing: false }
        );
        await screen.findByText(heroTitle);
        expect(baseElement).toMatchSnapshot();
      });
    });

    describe("ProductListerPage without initialProducts", () => {
      it("renders basic ProductListerPage", async () => {
        pageData.initialProducts = [];
        pageData.plpFilters.filters = [];
        const { baseElement } = renderWithStylesAndLocationProvider(
          pageData,
          pageContext
        );
        await screen.findByText(heroTitle);
        expect(baseElement).toMatchSnapshot();
      });
    });
    describe("ProductListerPage with multiple category codes", () => {
      describe("And First Category code on first initial product match", () => {
        it("renders category code Section Title", async () => {
          const localPageData: Props["data"] = {
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
            plpFilters: { filters: [], allowFilterBy: [] }
          };
          const localPageContext: PageContextType = {
            allowFilterBy: [],
            variantCode: "variant1",
            siteId: "siteId",
            countryCode: "no",
            categoryCodes: ["category-code-2", "category-code-1"],
            variantCodeToPathMap: {
              variant1: "variant1"
            }
          };

          const { baseElement } = renderWithStylesAndLocationProvider(
            localPageData,
            localPageContext
          );
          await screen.findByText("category-code-2");
          expect(baseElement).toMatchSnapshot();
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
            plpFilters: { filters: [], allowFilterBy: [] }
          };
          const localPageContext = {
            allowFilterBy: [],
            variantCode: "variant1",
            siteId: "siteId",
            countryCode: "no",
            categoryCodes: ["category-code-2", "category-code-1"],
            variantCodeToPathMap: {
              variant1: "variant1"
            }
          };
          const { baseElement } = renderWithStylesAndLocationProvider(
            localPageData,
            localPageContext
          );
          await screen.findByText(heroTitle);
          const categoryLabel = screen.queryByText("category-code-2");
          expect(categoryLabel).toBeNull();

          const categoryLabel3 = screen.queryByText("category-code-3");
          expect(categoryLabel3).toBeNull();
          expect(baseElement).toMatchSnapshot();
        });
      });
    });

    describe("When level 1 hero selected", () => {
      it("renders hero correctly", async () => {
        pageData.initialProducts = [productWithVariantAndBase];
        pageData.contentfulProductListerPage.heroType = "Level 1";

        const { baseElement } = renderWithStylesAndLocationProvider(
          pageData,
          pageContext
        );
        await screen.findByTestId("hero");
        expect(baseElement).toMatchSnapshot();
      });
    });

    describe("ProductListerPage with product filters", () => {
      describe("When Colour filters are provided", () => {
        it("renders FiltersSidebar with color option with color Swatches", async () => {
          const color1Label = "colour-1";
          const color2Label = "colour-2";

          const productFilters: Filter[] = [
            {
              filterCode: "colour",
              name: "colour",
              label: "Colour",
              options: [
                { label: color1Label, value: "colour1" },
                { label: color2Label, value: "colour2" }
              ]
            }
          ];
          pageData.initialProducts = [productWithVariantAndBase];
          pageData.plpFilters = {
            filters: productFilters,
            allowFilterBy: ["colour"]
          };
          const { baseElement } = renderWithStylesAndLocationProvider(
            pageData,
            pageContext
          );
          screen.getByLabelText(color1Label);
          expect(screen.getByText(color2Label)).toBeInTheDocument();
          expect(baseElement).toMatchSnapshot();
        });
      });

      describe("When level 1 hero selected", () => {
        it("renders hero correctly", async () => {
          pageData.initialProducts = [productWithVariantAndBase];
          pageData.contentfulProductListerPage.heroType = "Level 1";

          const { baseElement } = renderWithStylesAndLocationProvider(
            pageData,
            pageContext
          );
          await screen.findByTestId("hero");
          expect(baseElement).toMatchSnapshot();
        });
      });

      describe("When Other filters are provided", () => {
        it("renders FiltersSidebar with filter option checkboxes", async () => {
          const size1Label = "Size-1";
          const size2Label = "Size-2";

          const productFilters: Filter[] = [
            {
              filterCode: "size",
              name: "size",
              label: "Size",
              options: [
                { label: size1Label, value: "10mm" },
                { label: size2Label, value: "20mm" }
              ]
            }
          ];
          pageData.initialProducts = [productWithVariantAndBase];
          pageData.plpFilters.filters = productFilters;
          const { baseElement } = renderWithStylesAndLocationProvider(
            pageData,
            pageContext
          );
          screen.getByLabelText(size1Label);
          expect(screen.getByText(size2Label)).toBeInTheDocument();
          expect(baseElement).toMatchSnapshot();
        });
      });
    });
  });

  it("renders an default image if there is no image available", async () => {
    pageData.initialProducts = [
      { ...productWithVariantAndBase, images: undefined }
    ];
    pageData.contentfulProductListerPage.heroType = "Spotlight";
    const { baseElement } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext,
      { isPreviewMode: true }
    );
    await screen.findByText(heroTitle);
    expect(baseElement).toMatchSnapshot();
  });

  it("no search for Gatsby preview", async () => {
    pageData.initialProducts = [productWithVariantAndBase];
    pageData.contentfulProductListerPage.heroType = "Spotlight";
    const { baseElement } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext,
      { isPreviewMode: true }
    );
    await screen.findByText(heroTitle);
    expect(baseElement).toMatchSnapshot();
  });

  it("test handle change by click on pagination", async () => {
    const products = new Array(30).fill(productWithVariantAndBase);
    pageData.initialProducts = [...products];
    jest.spyOn(window, "scrollTo").mockImplementation();
    renderWithStylesAndLocationProvider(pageData, pageContext);
    fireEvent.click(screen.getByLabelText("Go to next page"));
    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith(0, -200);
    });
  });

  it("test handle fetch product by click on pagination when ES return hits", async () => {
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
    pageData.contentfulProductListerPage.heroType = "Level 1";
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
    const { baseElement } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    fireEvent.click(screen.getByLabelText("Go to next page"));
    expect(mockQueryES).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it("test handle fetch product by click on pagination when ES return aggregations", async () => {
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
    const { baseElement } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    fireEvent.click(screen.getByLabelText("Go to next page"));
    expect(mockQueryES).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it("test handle change url by click on filters and test clear all click", async () => {
    window.history.replaceState = jest.fn();
    const color1Label = "colour-1";
    const color2Label = "colour-2";
    const productFilters: Filter[] = [
      {
        filterCode: "colour",
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
    pageData.plpFilters = {
      filters: productFilters,
      allowFilterBy: ["colour"]
    };
    const { baseElement } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.queryByText(color2Label));
    expect(window.history.replaceState).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("MC: plp.filters.clearAll"));
    expect(window.history.replaceState).toHaveBeenCalledTimes(2);
  });

  it("test filter resolver utils when it is not a colour name", async () => {
    const texture1Label = "texture-1";
    const texture2Label = "texture-2";

    const plpFilters: Filter[] = [
      {
        filterCode: "texturefamily",
        name: "texturefamily",
        label: "texture",
        options: [
          { label: texture1Label, value: "texture1" },
          { label: texture2Label, value: "texture2" }
        ]
      }
    ];
    pageData.initialProducts = [productWithVariantAndBase];
    pageData.plpFilters = {
      filters: plpFilters,
      allowFilterBy: ["texturefamily"]
    };
    const { baseElement } = renderWithStylesAndLocationProvider(
      pageData,
      pageContext
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("should prevent fetch products on GATSBY_PREVIEW", async () => {
    jest.spyOn(window, "alert").mockImplementation();
    const products = new Array(30).fill(productWithVariantAndBase);
    pageData.initialProducts = [...products];
    renderWithStylesAndLocationProvider(pageData, pageContext, {
      isPreviewMode: true
    });
    fireEvent.click(screen.getByLabelText("Go to next page"));

    expect(window.alert).toHaveBeenCalledWith(
      "You cannot search on the preview environment."
    );
  });
});
