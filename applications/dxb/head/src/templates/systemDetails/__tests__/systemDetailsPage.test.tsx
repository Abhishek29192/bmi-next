import { History } from "@reach/router";
import { screen, waitFor } from "@testing-library/dom";
import React from "react";

import ProvideStyles from "../../../components/__tests__/utils/StylesProvider";
import { ConfigProvider, EnvConfig } from "../../../contexts/ConfigProvider";
import { createMockSiteData } from "../../../test/mockSiteData";
import { renderWithRouter } from "../../../test/renderWithRouter";
import createProduct from "../../../__tests__/helpers/ProductHelper";
import createRelatedSystem from "../../../__tests__/helpers/RelatedSystemHelper";
import createSystem from "../../../__tests__/helpers/SystemHelper";
import createSystemLayer from "../../../__tests__/helpers/SystemLayerHelper";
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
  customConfig?: EnvConfig["config"];
  routerObject?: { route?: string; history?: History };
  renderComponent: React.ReactElement;
}) => {
  return renderWithRouter(
    <ConfigProvider configObject={customConfig}>
      <ProvideStyles>{renderComponent}</ProvideStyles>
    </ConfigProvider>,
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

  it("should render", () => {
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
    const tabSection = container.querySelector(".TabsBar");

    expect(container).toMatchSnapshot();
    expect(tabSection).toBeInTheDocument();
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

    const layersRelatedProducts = container.querySelector(
      "Zanda Protector normalstein"
    );
    expect(container).toMatchSnapshot();
    expect(layersRelatedProducts).not.toBeInTheDocument();
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
      await screen.queryByText("MC: sdp.leadBlock.specification")
    ).toBeNull();

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

    const brandLogo = container.querySelector("brandLogo");
    expect(brandLogo).not.toBeInTheDocument();
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
        await waitFor(() => screen.findAllByText("duplicate-product-1"))
      ).toHaveLength(1);

      expect(container).toMatchSnapshot();
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
