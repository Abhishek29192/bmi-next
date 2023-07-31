import { ThemeProvider } from "@bmi-digital/components";
import { History } from "@reach/router";
import { screen, waitFor } from "@testing-library/react";
import React from "react";
import createProduct from "../../../__tests__/helpers/ProductHelper";
import createRelatedSystem from "../../../__tests__/helpers/RelatedSystemHelper";
import createSystem from "../../../__tests__/helpers/SystemHelper";
import createSystemLayer from "../../../__tests__/helpers/SystemLayerHelper";
import { Config, ConfigProvider } from "../../../contexts/ConfigProvider";
import { createMockSiteData } from "../../../test/mockSiteData";
import { renderWithRouter } from "../../../test/renderWithRouter";
import SystemDetailsPage from "../systemDetailsPage";

const systemCode = "1234";
const siteId = "1234";
const allContentfulAssetType = {
  nodes: [
    {
      name: "CAD display name",
      pimCode: "CAD"
    }
  ]
};
const systemDetailsMockData = createSystem({
  code: "1234",
  relatedSystems: [
    createRelatedSystem({
      code: "related-system-code",
      brand: { code: "brand-code" },
      name: "related-system-1",
      scoringWeight: 1,
      shortDescription: "related-short-desc",
      path: "related-path"
    })
  ]
});
jest.mock("gatsby");

const withProviders = ({
  customConfig = { isBrandProviderEnabled: true },
  routerObject,
  renderComponent
}: {
  customConfig?: Partial<Config>;
  routerObject?: { route?: string; history?: History };
  renderComponent: React.ReactElement;
}) => {
  return renderWithRouter(
    <ThemeProvider>
      <ConfigProvider configOverride={customConfig}>
        {renderComponent}
      </ConfigProvider>
    </ThemeProvider>,
    routerObject
  );
};

describe("SystemDetailsPage template component", () => {
  beforeEach(() => {
    // resolve useDimensions (useState) hook in ProductFeatureTable
    jest.mock("react", () => ({
      ...(jest.requireActual("react") as any),
      useState: (initial) => [initial, jest.fn()]
    }));
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component", () => {
    const { container } = withProviders({
      customConfig: { spaceMarketCode: "no" },
      renderComponent: (
        <SystemDetailsPage
          data={{
            contentfulSite: createMockSiteData(),
            shareWidget: null,
            system: systemDetailsMockData,
            allContentfulAssetType
          }}
          pageContext={{
            systemCode: systemCode,
            siteId
          }}
        />
      )
    });

    expect(container).toMatchSnapshot();
  });

  it("should render without BrandProvider", () => {
    const { container } = withProviders({
      customConfig: { spaceMarketCode: "no" },
      renderComponent: (
        <SystemDetailsPage
          data={{
            contentfulSite: createMockSiteData(),
            shareWidget: null,
            system: systemDetailsMockData,
            allContentfulAssetType
          }}
          pageContext={{
            systemCode: systemCode,
            siteId
          }}
        />
      )
    });

    expect(screen.getByTestId("tabs")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should render without systemLayers", async () => {
    const systemDetails = createSystem({ systemLayers: [] });
    const { container } = withProviders({
      customConfig: { spaceMarketCode: "no" },
      renderComponent: (
        <SystemDetailsPage
          data={{
            contentfulSite: createMockSiteData(),
            shareWidget: null,
            system: systemDetails,
            allContentfulAssetType
          }}
          pageContext={{
            systemCode: systemCode,
            siteId
          }}
        />
      )
    });

    expect(container).toMatchSnapshot();
    expect(
      screen.queryByTestId("system-layers-accordion")
    ).not.toBeInTheDocument();
  });

  it("should render without specifications", async () => {
    const systemDetails = createSystem({ specification: null });
    const { container } = withProviders({
      customConfig: { spaceMarketCode: "no" },
      renderComponent: (
        <SystemDetailsPage
          data={{
            contentfulSite: createMockSiteData(),
            shareWidget: null,
            system: systemDetails,
            allContentfulAssetType
          }}
          pageContext={{
            systemCode: systemCode,
            siteId
          }}
        />
      )
    });

    expect(
      screen.queryByText("MC: sdp.leadBlock.specification")
    ).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should render without Brand logo", async () => {
    const systemDetails = createSystem({ brand: null });
    const { container } = withProviders({
      customConfig: { spaceMarketCode: "no" },
      renderComponent: (
        <SystemDetailsPage
          data={{
            contentfulSite: createMockSiteData(),
            shareWidget: null,
            system: systemDetails,
            allContentfulAssetType
          }}
          pageContext={{
            systemCode: systemCode,
            siteId
          }}
        />
      )
    });

    expect(
      screen.queryByTestId("lead-block-brand-logo")
    ).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  describe("gtm on landing on sdp from sc", () => {
    it("run pushtogtm data layer if selected_system in query param", () => {
      const { container } = withProviders({
        renderComponent: (
          <SystemDetailsPage
            data={{
              contentfulSite: createMockSiteData(),
              shareWidget: null,
              system: systemDetailsMockData,
              allContentfulAssetType
            }}
            pageContext={{
              systemCode: systemCode,
              siteId
            }}
          />
        ),
        routerObject: {
          route:
            "http://localhost:8000/no/system-details-page?selected_system=Recomended_System1&prev_page=system-configurator-page"
        }
      });

      expect(container).toMatchSnapshot();
    });
  });

  describe("systemLayers tests", () => {
    it("should render with all systemLayers", async () => {
      const systemDetails = createSystem({
        systemLayers: [createSystemLayer()]
      });
      const { container } = withProviders({
        customConfig: { spaceMarketCode: "no" },
        renderComponent: (
          <SystemDetailsPage
            data={{
              contentfulSite: createMockSiteData(),
              shareWidget: null,
              system: systemDetails,
              allContentfulAssetType
            }}
            pageContext={{
              systemCode: systemCode,
              siteId
            }}
          />
        )
      });

      expect(container).toMatchSnapshot();
      expect(
        screen.getByText("1. layer-type-1: system-layer-1")
      ).toBeInTheDocument();

      expect(screen.getByText("related-product-1")).toBeInTheDocument();
      expect(screen.getByText("layer-short-description")).toBeInTheDocument();

      expect(
        screen.getByText("MC: sdp.optionalProductsTitle")
      ).toBeInTheDocument();

      expect(
        screen.getByText("optional-related-product-1")
      ).toBeInTheDocument();
    });

    it("should NOT render duplicate products in related products and optional related products", async () => {
      const systemDetails = createSystem({
        systemLayers: [
          createSystemLayer({
            relatedProducts: [
              createProduct({
                code: "duplicate-product-1",
                name: "duplicate-product-1"
              })
            ],
            relatedOptionalProducts: [
              createProduct({
                code: "duplicate-product-1",
                name: "duplicate-product-1"
              }),
              createProduct({
                code: "optional-related-product-1",
                name: "optional-related-product-1"
              })
            ]
          })
        ]
      });
      withProviders({
        customConfig: { spaceMarketCode: "no" },
        renderComponent: (
          <SystemDetailsPage
            data={{
              contentfulSite: createMockSiteData(),
              shareWidget: null,
              system: systemDetails,
              allContentfulAssetType
            }}
            pageContext={{
              systemCode: systemCode,
              siteId
            }}
          />
        )
      });

      expect(
        await waitFor(() => screen.findAllByText("duplicate-product-1"))
      ).toHaveLength(1);

      expect(
        screen.getByText("1. layer-type-1: system-layer-1")
      ).toBeInTheDocument();

      expect(screen.getByText("layer-short-description")).toBeInTheDocument();

      expect(
        screen.getByText("MC: sdp.optionalProductsTitle")
      ).toBeInTheDocument();

      expect(
        screen.getByText("optional-related-product-1")
      ).toBeInTheDocument();
    });
  });
});
