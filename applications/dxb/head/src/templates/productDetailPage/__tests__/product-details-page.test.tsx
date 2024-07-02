import ThemeProvider from "@bmi-digital/components/theme-provider";
import { LocationProvider } from "@reach/router";
import { render, screen } from "@testing-library/react";
import React from "react";
import createProduct from "../../../__tests__/helpers/ProductHelper";
import { Data as SiteData } from "../../../components/Site";
import { createMockSiteData } from "../../../test/mockSiteData";
import { Product } from "../../../types/pim";
import ProductDetailsPage, { Props as PdpProps } from "../product-details-page";
import createPimImage from "../../../__tests__/helpers/PimImageHelper";

const mockPageContext: PdpProps["pageContext"] = {
  productCode: "test-product-code",
  siteId: "test-site-id",
  countryCode: "test-country-code"
};

const mockResources = createMockSiteData();
const mockProduct = createProduct({ videos: [] });
const mockSiteData = createMockSiteData({
  resources: {
    ...mockResources.resources,
    pdpShareWidget: {
      ...mockResources.resources!.pdpShareWidget,
      email: true,
      facebook: true,
      copy: true
    }
  }
});

const renderPdpPage = ({
  product = mockProduct,
  contentfulSite = mockSiteData
}: {
  product?: Product;
  contentfulSite?: SiteData;
}) => {
  return render(
    <ThemeProvider>
      <LocationProvider>
        <ProductDetailsPage
          data={{
            product: {
              ...product
            },
            contentfulSite
          }}
          pageContext={mockPageContext}
        />
      </LocationProvider>
    </ThemeProvider>
  );
};

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("Product Details Page", () => {
  it("should render correctly", () => {
    renderPdpPage({});

    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-lead-block-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("related-products-section")).toBeInTheDocument();
    expect(screen.getByTestId("pdp-cards-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-explorer-bar-section")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumbs-section-bottom")
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-page-breadcrumbs-top")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("MC: share.email")).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments![0].assetType}Download`
      )
    ).toBeInTheDocument();
  });

  it("shouldn't render KeyAssetTypesDownloadSection when product doesn't have any keyAssetDocuments", () => {
    const product = {
      ...mockProduct,
      keyAssetDocuments: []
    };
    renderPdpPage({
      product
    });

    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-lead-block-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("related-products-section")).toBeInTheDocument();
    expect(screen.getByTestId("pdp-cards-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-explorer-bar-section")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumbs-section-bottom")
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-page-breadcrumbs-top")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("MC: share.email")).toBeInTheDocument();
    expect(
      screen.queryByTestId(
        `${mockProduct.keyAssetDocuments![0].assetType}Download`
      )
    ).not.toBeInTheDocument();
  });

  it("shouldn't render ShareWidget", () => {
    const contentfulSite = createMockSiteData({
      resources: {
        ...mockResources.resources,
        pdpShareWidget: null
      }
    });
    renderPdpPage({
      contentfulSite
    });

    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-lead-block-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("related-products-section")).toBeInTheDocument();
    expect(screen.getByTestId("pdp-cards-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-explorer-bar-section")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumbs-section-bottom")
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-page-breadcrumbs-top")
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("MC: share.email")).not.toBeInTheDocument();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments![0].assetType}Download`
      )
    ).toBeInTheDocument();
  });

  it("shouldn't render Related Products section", () => {
    const product = {
      ...mockProduct,
      relatedProducts: []
    };
    renderPdpPage({ product });

    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-lead-block-section")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("related-products-section")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("pdp-cards-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-explorer-bar-section")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumbs-section-bottom")
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-page-breadcrumbs-top")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("MC: share.email")).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments![0].assetType}Download`
      )
    ).toBeInTheDocument();
  });

  it("shouldn't render PDP cards section if cards doesn't exist", () => {
    const contentfulSite = createMockSiteData({
      resources: {
        ...mockResources.resources,
        pdpCards: null
      }
    });
    renderPdpPage({ contentfulSite });

    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-lead-block-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("related-products-section")).toBeInTheDocument();
    expect(screen.queryByTestId("pdp-cards-section")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-explorer-bar-section")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumbs-section-bottom")
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-page-breadcrumbs-top")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments![0].assetType}Download`
      )
    ).toBeInTheDocument();
  });

  it("shouldn't render PDP cards section if wasn't pvovided", () => {
    const contentfulSite = createMockSiteData({
      resources: {
        ...mockResources.resources,
        pdpCardsTitle: null
      }
    });
    renderPdpPage({ contentfulSite });

    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-lead-block-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("related-products-section")).toBeInTheDocument();
    expect(screen.queryByTestId("pdp-cards-section")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-explorer-bar-section")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumbs-section-bottom")
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-page-breadcrumbs-top")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments![0].assetType}Download`
      )
    ).toBeInTheDocument();
  });

  it("shouldn't render Explorer Bar section", () => {
    const contentfulSite = createMockSiteData({
      resources: {
        ...mockResources.resources,
        pdpExploreBar: null
      }
    });
    renderPdpPage({ contentfulSite });

    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-product-lead-block-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("related-products-section")).toBeInTheDocument();
    expect(screen.getByTestId("pdp-cards-section")).toBeInTheDocument();
    expect(
      screen.queryByTestId("product-details-product-explorer-bar-section")
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("breadcrumbs-section-bottom")
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(
      screen.getByTestId("product-details-page-breadcrumbs-top")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments![0].assetType}Download`
      )
    ).toBeInTheDocument();
  });

  describe("Media Component", () => {
    it("should render both a masterImage and a galleryImage if both are defined", () => {
      const product: Product = {
        ...mockProduct,
        masterImage: createPimImage({
          altText: "example-master-image-alt-text"
        }),
        galleryImages: [
          createPimImage({ altText: "example-gallery-image-alt-text" })
        ]
      };

      renderPdpPage({ product });

      expect(
        screen.getAllByTestId("pim-image-example-master-image-alt-text")[0]
      ).toBeInTheDocument();
      expect(
        screen.getAllByTestId("pim-image-example-gallery-image-alt-text")[0]
      ).toBeInTheDocument();
    });

    it("should only render the galleryImage if galleryImages are defined and masterImage is null", () => {
      const product: Product = {
        ...mockProduct,
        masterImage: null,
        galleryImages: [
          createPimImage({ altText: "example-gallery-image-alt-text" })
        ]
      };

      renderPdpPage({ product });

      expect(screen.getAllByTestId("media-gallery-root")[0]).toMatchSnapshot();
      expect(
        screen.getAllByTestId("pim-image-example-gallery-image-alt-text")[0]
      ).toBeInTheDocument();
    });

    it("should render the fallback image if both masterImage and galleryImages are not provided", () => {
      const product: Product = {
        ...mockProduct,
        masterImage: null,
        galleryImages: []
      };

      renderPdpPage({ product });

      expect(screen.getAllByTestId("media-gallery-root")[0]).toMatchSnapshot();
    });
  });
});
