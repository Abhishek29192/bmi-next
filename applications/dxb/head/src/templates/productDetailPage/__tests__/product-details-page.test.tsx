import { ThemeProvider } from "@bmi-digital/components";
import { LocationProvider } from "@reach/router";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Data as SiteData } from "../../../components/Site";
import { createMockSiteData } from "../../../test/mockSiteData";
import { Product } from "../../../types/pim";
import createProduct from "../../../__tests__/helpers/ProductHelper";
import ProductDetailsPage, { Props as PdpProps } from "../product-details-page";

const mockpageContext: PdpProps["pageContext"] = {
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
      ...mockResources.resources.pdpShareWidget,
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
          pageContext={mockpageContext}
        />
      </LocationProvider>
    </ThemeProvider>
  );
};

const pdpContent = [
  "ProductOverview",
  "ProductLeadBlock",
  "RelatedProducts",
  "PdpCardsSection",
  "ExploreBar",
  "ProductBreadcrumbs"
];

describe("Product Details Page", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  it("should render corectly", () => {
    const { container } = renderPdpPage({});

    pdpContent.forEach((item) =>
      expect(container.querySelector(`.${item}`)).toBeInTheDocument()
    );
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("[class*=Footer-root]")).toBeInTheDocument();
    expect(container.querySelector("[class*='Breadcrumbs']")).toBeTruthy();
    expect(screen.getByLabelText("MC: share.email")).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments[0].assetType}Download`
      )
    ).toBeInTheDocument();
  });
  it("shouldn't render KeyAssetTypesDownloadSection when product doesn't have any keyAssetDocuments", () => {
    const product = {
      ...mockProduct,
      keyAssetDocuments: []
    };
    const { container } = renderPdpPage({
      product
    });

    pdpContent.forEach((item) =>
      expect(container.querySelector(`.${item}`)).toBeInTheDocument()
    );
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("[class*=Footer-root]")).toBeInTheDocument();
    expect(container.querySelector("[class*='Breadcrumbs']")).toBeTruthy();
    expect(screen.getByLabelText("MC: share.email")).toBeInTheDocument();
    expect(
      screen.queryByTestId(
        `${mockProduct.keyAssetDocuments[0].assetType}Download`
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
    const { container } = renderPdpPage({
      contentfulSite
    });

    pdpContent.forEach((item) =>
      expect(container.querySelector(`.${item}`)).toBeInTheDocument()
    );
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("[class*=Footer-root]")).toBeInTheDocument();
    expect(container.querySelector("[class*='Breadcrumbs']")).toBeTruthy();
    expect(screen.queryByLabelText("MC: share.email")).not.toBeInTheDocument();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments[0].assetType}Download`
      )
    ).toBeInTheDocument();
  });

  it("shouldn't render Related Products section", () => {
    const product = {
      ...mockProduct,
      relatedProducts: []
    };
    const { container } = renderPdpPage({ product });

    pdpContent.forEach((item) => {
      if (item === "RelatedProducts") {
        expect(container.querySelector(`.${item}`)).not.toBeInTheDocument();
        return;
      }
      expect(container.querySelector(`.${item}`)).toBeInTheDocument();
    });
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("[class*=Footer-root]")).toBeInTheDocument();
    expect(container.querySelector("[class*='Breadcrumbs']")).toBeTruthy();
    expect(screen.queryByLabelText("MC: share.email")).toBeInTheDocument();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments[0].assetType}Download`
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
    const { container } = renderPdpPage({ contentfulSite });

    pdpContent.forEach((item) => {
      if (item === "PdpCardsSection") {
        expect(container.querySelector(`.${item}`)).not.toBeInTheDocument();
        return;
      }
      expect(container.querySelector(`.${item}`)).toBeInTheDocument();
    });
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("[class*=Footer-root]")).toBeInTheDocument();
    expect(container.querySelector("[class*='Breadcrumbs']")).toBeTruthy();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments[0].assetType}Download`
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
    const { container } = renderPdpPage({ contentfulSite });

    pdpContent.forEach((item) => {
      if (item === "PdpCardsSection") {
        expect(container.querySelector(`.${item}`)).not.toBeInTheDocument();
        return;
      }
      expect(container.querySelector(`.${item}`)).toBeInTheDocument();
    });
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("[class*=Footer-root]")).toBeInTheDocument();
    expect(container.querySelector("[class*='Breadcrumbs']")).toBeTruthy();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments[0].assetType}Download`
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
    const { container } = renderPdpPage({ contentfulSite });

    pdpContent.forEach((item) => {
      if (item === "ExploreBar") {
        expect(container.querySelector(`.${item}`)).not.toBeInTheDocument();
        return;
      }
      expect(container.querySelector(`.${item}`)).toBeInTheDocument();
    });
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("[class*=Footer-root]")).toBeInTheDocument();
    expect(container.querySelector("[class*='Breadcrumbs']")).toBeTruthy();
    expect(
      screen.getByTestId(
        `${mockProduct.keyAssetDocuments[0].assetType}Download`
      )
    ).toBeInTheDocument();
  });
});
